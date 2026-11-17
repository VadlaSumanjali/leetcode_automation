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

    public static volatile String lastConnectionStatus = "Initializing";
    public static volatile String activeJdbcUrl = "";

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
                int port = uri.getPort() > 0 ? uri.getPort() : 6543;
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

                activeUrl = "jdbc:postgresql://" + host + ":" + port + "/" + dbName + "?sslmode=require&prepareThreshold=0";
                driverClassName = "org.postgresql.Driver";
            } catch (Exception e) {
                log.warn("Could not parse URI format for database URL, using raw: {}", e.getMessage());
            }
        }

        // Auto-upgrade Supabase pooler session port 5432 to transaction pooler port 6543
        if (activeUrl != null && activeUrl.contains("pooler.supabase.com:5432")) {
            activeUrl = activeUrl.replace("pooler.supabase.com:5432", "pooler.supabase.com:6543");
            log.info("Auto-upgraded Supabase pooler connection from session port 5432 to transaction port 6543");
        }

        // Ensure prepareThreshold=0 and sslmode=require for Supabase Pooler
        if (activeUrl != null && activeUrl.startsWith("jdbc:postgresql:")) {
            if (!activeUrl.contains("prepareThreshold")) {
                activeUrl += (activeUrl.contains("?") ? "&" : "?") + "prepareThreshold=0";
            }
            if (!activeUrl.contains("sslmode")) {
                activeUrl += (activeUrl.contains("?") ? "&" : "?") + "sslmode=require";
            }
        }

        // Determine if PostgreSQL or MySQL or H2
        if (activeUrl != null && !activeUrl.isBlank()) {
            activeJdbcUrl = activeUrl.replaceAll(":[^:@]+@", ":****@");
            if (activeUrl.startsWith("jdbc:postgresql:") && (password == null || password.isBlank())) {
                log.warn("Supabase PostgreSQL URL configured without password. Falling back to persistent in-memory database until production credentials are set.");
                lastConnectionStatus = "FALLBACK_H2: Database password is not set in environment";
                return createFallbackH2DataSource();
            }

            log.info("Configuring production DataSource with URL: {}", activeJdbcUrl);
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
            if (activeUrl.startsWith("jdbc:postgresql:")) {
                config.addDataSourceProperty("prepareThreshold", "0");
                config.addDataSourceProperty("sslmode", "require");
            }
            config.setMaximumPoolSize(10);
            config.setMinimumIdle(2);
            config.setIdleTimeout(30000);
            config.setConnectionTimeout(20000);
            config.setPoolName("LeetCodeDailyHikariPool");

            try {
                HikariDataSource ds = new HikariDataSource(config);
                try (java.sql.Connection conn = ds.getConnection()) {
                    lastConnectionStatus = "CONNECTED: " + conn.getMetaData().getDatabaseProductName() + " " + conn.getMetaData().getDatabaseProductVersion();
                    log.info("Successfully connected to production database: {}", conn.getMetaData().getDatabaseProductName());
                }
                return ds;
            } catch (Exception ex) {
                lastConnectionStatus = "FALLBACK_H2_ON_ERROR: " + ex.getMessage();
                log.error("Failed to connect to production database: {}. Falling back to internal database so web service stays healthy.", ex.getMessage());
                return createFallbackH2DataSource();
            }
        }

        activeJdbcUrl = "Fallback H2";
        lastConnectionStatus = "FALLBACK_H2: No external database configured";
        log.info("No external database configured. Initializing fallback DataSource.");
        return createFallbackH2DataSource();
    }

    private DataSource createFallbackH2DataSource() {
        HikariConfig config = new HikariConfig();
        // In-memory H2 ensures container safety across all environments without filesystem permission errors
        config.setJdbcUrl("jdbc:h2:mem:leetcodedaily;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;NON_KEYWORDS=USER,USERS");
        config.setDriverClassName("org.h2.Driver");
        config.setUsername("sa");
        config.setPassword("");
        config.setMaximumPoolSize(5);
        config.setPoolName("LeetCodeDailyFallbackH2Pool");
        return new HikariDataSource(config);
    }
}
