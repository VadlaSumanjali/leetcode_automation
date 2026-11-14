# LeetCode Daily — Personalized DSA Practice Platform

A full-stack, multi-user web application designed to help software engineers systematically improve their Data Structures and Algorithms skills through personalized problem scheduling, carry-forward logic, zero-duplicate assignment guarantees, Google Gemini AI hints, and 6:00 AM Gmail delivery.

---

## Technology Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router, Lucide React, Axios
- **Backend:** Java 21, Spring Boot 3.3.5, Spring Web, Spring Data JPA, Spring Security, Spring Validation, Spring Scheduler, JavaMailSender
- **Database:** MySQL 8.0 (with Flyway database migrations)
- **AI Integration:** Google Gemini API (via Google AI Studio, configurable model via env)
- **Email Delivery:** Gmail SMTP with Google App Password (Spring Boot JavaMailSender)
- **Containerization:** Docker & Docker Compose

---

## Project Structure

```
leetcode_auto/
├── .env.example               # Template environment configuration (safe to commit)
├── .env                       # Local secrets (NEVER committed to git)
├── .gitignore                 # Excludes secrets, target, dist, node_modules
├── docker-compose.yml         # MySQL 8, Backend & Frontend container definitions
├── README.md                  # System documentation & run guide
│
├── frontend/                  # React + Vite + Tailwind CSS Application
│   ├── package.json
│   ├── vite.config.js         # API reverse proxy to http://localhost:8080
│   ├── tailwind.config.js     # Light theme palette (slate surfaces, indigo accents)
│   ├── index.html
│   ├── Dockerfile             # Multi-stage production Nginx build
│   └── src/
│       ├── api/client.js      # Centralized Axios client with JWT interceptors
│       ├── components/        # Navbar, Footer, Card, Badge (Difficulty & Status)
│       └── pages/             # 10 pages: Landing, Login, Register, Onboarding,
│                              # Dashboard, Daily Plan, Problem Details,
│                              # Problem History, Topic Progress, Settings
│
└── backend/                   # Spring Boot 3 & Java 21 Application
    ├── pom.xml                # Maven configuration with Spring Boot 3.3.5
    ├── mvnw / mvnw.cmd        # Portable Maven wrapper
    ├── Dockerfile             # Multi-stage Eclipse Temurin JDK 21 container
    └── src/
        ├── main/
        │   ├── java/com/leetcodedaily/
        │   │   ├── LeetCodeDailyApplication.java
        │   │   ├── config/       # SecurityConfig, CorsConfig, SchedulerConfig
        │   │   ├── controller/   # HealthController (/api/v1/health)
        │   │   ├── dto/          # ApiResponse<T> standardized JSON envelope
        │   │   └── exception/    # Centralized GlobalExceptionHandler
        │   └── resources/
        │       ├── application.yml
        │       └── application-dev.yml
        └── test/                 # JUnit tests (HealthControllerTest)
```

---

## Getting Started Locally

### 1. Configure Environment
Copy the example environment file:
```powershell
Copy-Item .env.example .env
```
Ensure your database credentials, Gemini API key, and Gmail App Password are configured in `.env`.

### 2. Run Backend
Navigate to `backend` and start the Spring Boot application:
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```
The health check endpoint will be available at:
`http://localhost:8080/api/v1/health`

### 3. Run Frontend
In a separate terminal, navigate to `frontend` and start Vite dev server:
```powershell
cd frontend
npm install
npm run dev
```
Open your browser at `http://localhost:5173`.

### 4. Run With Docker Compose
When Docker Desktop is running:
```powershell
docker compose up -d mysql
```
Or start all services together:
```powershell
docker compose up --build
```

