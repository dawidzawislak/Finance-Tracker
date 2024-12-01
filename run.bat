@echo off

start /wait cmd /c "cd server && pip install -r requirements.txt && cd ..\app && npm i"

start cmd /k "cd server && python main.py"

timeout /t 3 /nobreak

start cmd /k "cd app && npm run dev"

timeout /t 3 /nobreak

start http://localhost:5173/