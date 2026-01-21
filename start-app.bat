@echo off
echo Starting InternTracker...
start "Backend" cmd /k "cd backend && npm start"
start "Frontend" cmd /k "cd frontend && npm start"
echo application started!
