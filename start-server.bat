@echo off
echo Starting SleepOutside Local Server...
echo.
echo Opening browser at http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
python -m http.server 8000
