@echo off
setlocal
cd /d "%~dp0"

echo.
echo ============================================
echo   Starting ATHENA Autonomous Daemon
echo   ATHENA / ATHENA-Hermes Swarm
echo ============================================
echo.

python -m core.ATHENA_daemon %*

echo.
echo ATHENA daemon exited.
pause


