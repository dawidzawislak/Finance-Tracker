@echo off

start /wait cmd /c "cd server && pip install -r requirements.txt && cd ..\app && npm i"

start cmd /k "cd server && python main.py"

start cmd /k "cd app && npm run dev"

timeout /t 2 /nobreak

start http://localhost:5173/