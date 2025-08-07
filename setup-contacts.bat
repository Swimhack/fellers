@echo off
echo.
echo ================================================
echo    Fellers Resources Contact Form Setup
echo ================================================
echo.

echo Installing required dependencies...
npm install dotenv
echo.

echo Running setup script...
npm run setup-contacts
echo.

echo Setup complete! Check the output above for any errors.
echo.

pause