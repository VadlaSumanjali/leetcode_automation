@REM ----------------------------------------------------------------------------
@REM Maven Wrapper Script for LeetCode Daily Backend
@REM ----------------------------------------------------------------------------
@echo off
setlocal

set "MAVEN_CMD=mvn"
where mvn >nul 2>&1
if %ERRORLEVEL% equ 0 (
    "%MAVEN_CMD%" %*
    exit /b %ERRORLEVEL%
)

for /d %%D in ("%USERPROFILE%\.m2\wrapper\dists\apache-maven-*") do (
    for /d %%S in ("%%D\*") do (
        if exist "%%S\bin\mvn.cmd" (
            set "MAVEN_CMD=%%S\bin\mvn.cmd"
            goto runMaven
        )
    )
)

:runMaven
if exist "%MAVEN_CMD%" (
    call "%MAVEN_CMD%" %*
    exit /b %ERRORLEVEL%
)

echo [ERROR] Maven not found. Please install Maven or ensure Docker is available.
exit /b 1

