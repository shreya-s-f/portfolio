@echo off
echo ============================================================
echo   SHREYA FAKIRAPUR - GITHUB PORTFOLIO DEPLOYMENT HELPER
echo ============================================================
echo.
echo Make sure you have created an empty repository on GitHub first:
echo e.g., https://github.com/shreya-s-f/portfolio OR https://github.com/shreya-s-f/shreya-s-f.github.io
echo.
set /p REPO_URL="Enter your GitHub Repository URL (or press Enter for default 'https://github.com/shreya-s-f/portfolio.git'): "

if "%REPO_URL%"=="" (
    set REPO_URL=https://github.com/shreya-s-f/portfolio.git
)

echo.
echo Initializing and preparing commits...
git add .
git commit -m "feat: launch futuristic interactive animated portfolio"
git branch -M main

echo.
echo Setting remote origin to %REPO_URL%...
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
if %ERRORLEVEL% EQU 0 (
    echo [SUCCESS] Your portfolio has been pushed to GitHub successfully!
    echo.
    echo Next step to view it online:
    echo 1. Go to your repo on GitHub: Settings -^> Pages
    echo 2. Set Branch to 'main' and folder to '/ (root)'
    echo 3. Click Save!
) else (
    echo [NOTE] If you were prompted for credentials, please sign in or use a Personal Access Token / GitHub Desktop.
)
echo.
pause
