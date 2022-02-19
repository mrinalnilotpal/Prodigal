# Prodigal
Assignment Code and FIles

# Flow
1. on first time run this script will download the mutual-funds data and save it into mutual-fund-data.csv
1. then it will load all the data into the sqlite database (may take a long time)
1. Once the app finishes on subsequent run it will download the latest data and save it in latest.csv


# Installation
1. use ```npm install``` to install all the dependancies
1. use ```npm start``` to run the app 

# Notes
1. To reset the app make the following changes:
  - delete all .csv files
  - delete all .sqlite file
  - in src/config.json change ```"initialLoad":false```

# Tools used
- nodejs for running js
- axios for http requests
- sqlite3 for database
- fast-csv to parse csv files
