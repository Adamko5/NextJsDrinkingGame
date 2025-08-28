@echo off
REM ----------------------------
REM 1. Create Lobby
REM ----------------------------
echo Creating Lobby...
curl -X POST http://localhost:8080/api/lobby
echo.
pause

REM ----------------------------
REM 2. Get Lobby
REM ----------------------------
echo Getting Lobby...
curl http://localhost:8080/api/lobby
echo.
pause

REM ----------------------------
REM 3. Start Lobby
REM ----------------------------
echo Starting Lobby...
curl -X POST http://localhost:8080/api/lobby/start
echo.
pause

REM ----------------------------
REM 4. Advance Phase (with advanceBy parameter)
REM ----------------------------
echo Advancing Phase by 1...
curl -X POST "http://localhost:8080/api/lobby/advancePhaseBy?advanceBy=1"
echo.
pause

REM ----------------------------
REM 5. Add a Player
REM ----------------------------
echo Adding a Player...
curl -X POST http://localhost:8080/api/players -H "Content-Type: application/json" -d "{\"name\":\"John Doe\", \"gameClassName\":\"Russian\"}"
echo.
pause

REM ----------------------------
REM 6. Get All Players
REM ----------------------------
echo Getting All Players...
curl http://localhost:8080/api/players
echo.
pause

REM ----------------------------
REM 7. Get a Single Player
REM ----------------------------
echo Getting a Player...
curl http://localhost:8080/api/players/John%20Doe
echo.
pause

REM ----------------------------
REM 8. Add a Vote
REM ----------------------------
echo Adding a Vote...
curl -X POST http://localhost:8080/api/votes -H "Content-Type: application/json" -d "{\"byPlayer\":\"John Doe\", \"binary\":true, \"forPlayer\":\"John Doe\"}"
echo.
pause

REM ----------------------------
REM 9. Get All Votes
REM ----------------------------
echo Getting All Votes...
curl http://localhost:8080/api/votes
echo.
pause

REM ----------------------------
REM 10. Get a Vote
REM ----------------------------
echo Getting a Vote...
curl http://localhost:8080/api/votes/John%20Doe
echo.
pause

REM ----------------------------
REM 11. Get Snapshot
REM ----------------------------
echo Getting Snapshot...
curl http://localhost:8080/api/snapshot
echo.
pause