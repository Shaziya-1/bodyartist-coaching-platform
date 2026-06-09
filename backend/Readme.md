## How to run

1. Create VIrtual Environment
python -m venv coach-athlete 
if conda -> conda create -n coach-athlete python=3.10

2. Activate VIrtual Environment
.venv\Scripts\activate
if conda -> conda activate coach-athlete

3. install dependencies
pip install -r requirements.txt

4. install or run pgadmin / postgres
inside backend/.env
```cmd
add:  DATABASE_URL=postgresql://postgres:urnoob@localhost:5432/coach-athlete 
```


4. run app
uvicorn app.main:app --reload

