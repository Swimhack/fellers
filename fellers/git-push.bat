@echo off
cd /d "C:\STRICKLAND\Strickland Technology Marketing\fellersresources.com\fellers"
echo Checking git status...
git status
echo.
echo Adding all changes...
git add .
echo.
echo Committing changes...
git commit -m "Update unified image management system and contact form integration - Enhanced UnifiedImageManager for centralized image handling - Updated Gallery component to display random images from unified pool - Improved admin upload system with better storage stats - Fixed ContactForm to save to correct contacts table - Updated Supabase types to match database schema - Added admin contact submissions view at /admin/contacts"
echo.
echo Pushing to origin main...
git push origin main
echo.
echo Git push completed!