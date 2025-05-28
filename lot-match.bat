@echo off
cd /d "C:\Users\user\lot-match"

start cmd /k "php artisan serve"
start cmd /k "npm run dev"
start cmd /k "code ."