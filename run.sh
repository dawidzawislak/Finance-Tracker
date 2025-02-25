#!/bin/bash

(cd server && pip3 install -r requirements.txt)
(cd app && npm i)
(cd server && python3 main.py) &
sleep 3
(cd app && npm run dev) &
sleep 3
open http://localhost:5173/