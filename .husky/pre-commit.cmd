@echo off
REM Run lint-staged on staged files
npx --no-install lint-staged
exit /b %ERRORLEVEL%