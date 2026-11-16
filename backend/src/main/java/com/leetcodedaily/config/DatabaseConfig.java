package com.leetcodedaily.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    private static final Logger log = LoggerFactory.getLogger(DatabaseConfig.class);

    @Value("${spring.datasource.url:}")
    private String rawUrl;

    @Value("${DATABASE_URL:}")
    private String databaseUrl;

    @Value("${spring.datasource.username:${DB_USER:}}")
    private String username;

    @Value("${spring.datasource.password:${DB_PASSWORD:}}")
    private String password;

    @Value("${spring.datasource.driver-class-name:}")
    private String driverClassName;

    @Bean
    @Primary
    public DataSource dataSource() {
        String activeUrl = (rawUrl != null && !rawUrl.isBlank()) ? rawUrl : databaseUrl;

        // Auto-convert postgres:// or postgresql:// URI format into valid JDBC url
        if (activeUrl != null && (activeUrl.startsWith("postgres://") || activeUrl.startsWith("postgresql://"))) {
            try {
                URI uri = new URI(activeUrl.replace("postgresql://", "http://").replace("postgres://", "http://"));
                String host = uri.getHost();
                int port = uri.getPort() > 0 ? uri.getPort() : 5432;
                String path = uri.getPath();
                String dbName = (path != null && path.length() > 1) ? path.substring(1) : "postgres";

                if (uri.getUserInfo() != null) {
                    String[] userInfo = uri.getUserInfo().split(":");
                    if (userInfo.length > 0 && (username == null || username.isBlank())) {
                        username = userInfo[0];
                    }
                    if (userInfo.length > 1 && (password == null || password.isBlank())) {
                        password = userInfo[1];
                    }
                }

                activeUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName + "?sslmode=require";
                driverClassName = "org.postgresql.Driver";
            } catch (Exception e) {
                log.warn("Could not parse URI format for database URL, using raw: {}", e.getMessage());
            }
        }

        // Determine if PostgreSQL or MySQL or H2
        if (activeUrl != null && !activeUrl.isBlank()) {
            if (activeUrl.startsWith("jdbc:postgresql:") && (password == null || password.isBlank())) {
                log.warn("Supabase PostgreSQL URL configured without password. Falling back to persistent in-memory database until production credentials are set.");
                return createFallbackH2DataSource();
            }

            log.info("Configuring production DataSource with URL: {}", activeUrl.replaceAll(":[^:@]+@", ":****@"));
            HikariConfig config = new HikariConfig();
            config.setJdbcUrl(activeUrl);
            if (username != null && !username.isBlank()) {
                config.setUsername(username);
            }
            if (password != null && !password.isBlank()) {
                config.setPassword(password);
            }
            if (driverClassName != null && !driverClassName.isBlank()) {
                config.setDriverClassName(driverClassName);
            }
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setIdleTimeout(30000);
            config.setConnectionTimeout(20000);
            config.setPoolName("LeetCodeDailyHikariPool");

            try {
                HikariDataSource ds = new HikariDataSource(config);
                try (java.sql.Connection conn = ds.getConnection()) {
                    log.info("Successfully connected to production database: {}", conn.getMetaData().getDatabaseProductName());
                }
                return ds;
            } catch (Exception ex) {
                log.error("Failed to connect to production database: {}. Falling back to internal database so web service stays healthy.", ex.getMessage());
                return createFallbackH2DataSource();
            }
        }

        log.info("No external database configured. Initializing fallback DataSource.");
        return createFallbackH2DataSource();
    }

    private DataSource createFallbackH2DataSource() {
        HikariConfig config = new HikariConfig();
        // File-based H2 database for local persistence across restarts so users and progress are preserved
        config.setJdbcUrl("jdbc:h2:file:./data/leetcodedaily;AUTO_SERVER=TRUE;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;NON_KEYWORDS=USER,USERS");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(5);
        config.setPoolName("LeetCodeDailyPersistentH2Pool");
        return new HikariDataSource(config);
    }
}
