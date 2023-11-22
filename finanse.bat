@echo off
cd server
start node index.js
cd ..
start "" ".\app\index.html"