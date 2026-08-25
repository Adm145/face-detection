@echo off
cd /d "D:\FS- Projects\face-detection"
set PYTHONPATH=.
echo ==== %date% %time% ==== >> data\backup_pull.log
".venv\Scripts\python.exe" db_init_setup\pull_postgres_to_sqlite.py >> data\backup_pull.log 2>&1
".venv\Scripts\python.exe" db_init_setup\pull_qdrant_to_local.py >> data\backup_pull.log 2>&1
