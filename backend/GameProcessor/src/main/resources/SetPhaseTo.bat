@echo off
REM Prompt the user for the phase value and use it in the request
set /p PHASE=Enter phase value to set (e.g. 1): 
if "%PHASE%"=="" (
  echo No phase entered. Aborting.
  pause
  exit /b 1
)

echo Advancing Phase to %PHASE%...
curl -X POST "http://localhost:8080/api/lobby/setPhaseAndClean?setPhaseTo=%PHASE%"

echo.
