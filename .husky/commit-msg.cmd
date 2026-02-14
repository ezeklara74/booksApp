@echo off
REM %1 is the path to the temporary commit message file
npx --no-install commitlint --edit "%~1"
exit /b %ERRORLEVEL%