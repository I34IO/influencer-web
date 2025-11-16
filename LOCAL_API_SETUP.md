# Running the Backend API Locally

## Overview
The backend API is located in the parent directory (`/Users/roane/roane/perso/hack-the-gap/`) and is built with Python. Currently, the frontend connects to a remote API at `http://10.80.222.41:3000/api/public`.

## Backend Files Structure
```
/Users/roane/roane/perso/hack-the-gap/
├── analyzer.py              # Influencer analysis logic
├── config.py                # Configuration
├── database.py              # Database operations
├── influencer_monitor.db    # SQLite database
├── orchestrator.py          # Main orchestration
├── scorer.py                # Scoring system
├── streamlit_app.py         # Streamlit dashboard
├── test_app.py              # Testing
├── scrapers/                # Web scrapers
├── requirements.txt         # Python dependencies
└── influencer-app/          # Next.js frontend (current directory)
```

## Steps to Run Backend API Locally

### 1. Navigate to Backend Directory
```bash
cd /Users/roane/roane/perso/hack-the-gap
```

### 2. Set Up Python Virtual Environment
```bash
# Create virtual environment (if not exists)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# OR
venv\Scripts\activate     # On Windows
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Check if Backend API Server Exists
The backend might be running as:
- **Streamlit app**: `streamlit_app.py`
- **Flask/FastAPI server**: Check for `app.py`, `main.py`, or `server.py`
- **Custom server**: Check `orchestrator.py` or `test_app.py`

Let's check what's available:
```bash
# Check for Flask/FastAPI
grep -r "Flask\|FastAPI\|@app.route" *.py

# Check orchestrator
python orchestrator.py --help

# Or run streamlit
streamlit run streamlit_app.py
```

### 5. Start the Backend Server

#### Option A: If there's a Flask/FastAPI server
```bash
# Flask
python app.py
# OR
flask run --port 3000

# FastAPI
uvicorn main:app --reload --port 3000
```

#### Option B: If using Streamlit
```bash
streamlit run streamlit_app.py --server.port 3000
```

#### Option C: If using orchestrator
```bash
python orchestrator.py
```

### 6. Verify Backend is Running
```bash
# Test the API
curl http://localhost:3000/api/public/influencers?limit=5
curl http://localhost:3000/api/public/stats
```

## Update Frontend to Use Local API

### Option 1: Update .env.local (Recommended)
Edit `/Users/roane/roane/perso/hack-the-gap/influencer-app/.env.local`:

```bash
# Change from remote API
# NEXT_PUBLIC_API_BASE_URL="http://10.80.222.41:3000/api/public"

# To local API
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api/public"
```

Then restart the Next.js dev server:
```bash
cd /Users/roane/roane/perso/hack-the-gap/influencer-app
npm run dev
```

### Option 2: Temporary Override
You can also temporarily override in the terminal:
```bash
cd /Users/roane/roane/perso/hack-the-gap/influencer-app
NEXT_PUBLIC_API_BASE_URL="http://localhost:3000/api/public" npm run dev
```

## Creating a Backend API Server (If Needed)

If the backend doesn't have an API server yet, here's a simple FastAPI example:

### 1. Install FastAPI
```bash
cd /Users/roane/roane/perso/hack-the-gap
pip install fastapi uvicorn python-multipart
```

### 2. Create `api_server.py`
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    conn = sqlite3.connect('influencer_monitor.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/api/public/influencers")
async def get_influencers(limit: int = 100, sortBy: str = "trustScore", sortOrder: str = "desc"):
    conn = get_db()
    cursor = conn.cursor()
    
    order = "DESC" if sortOrder.lower() == "desc" else "ASC"
    query = f"SELECT * FROM influencers ORDER BY {sortBy} {order} LIMIT ?"
    
    cursor.execute(query, (limit,))
    rows = cursor.fetchall()
    
    influencers = [dict(row) for row in rows]
    conn.close()
    
    return {"success": True, "data": influencers}

@app.get("/api/public/stats")
async def get_stats():
    conn = get_db()
    cursor = conn.cursor()
    
    cursor.execute("SELECT COUNT(*) as total FROM influencers")
    total = cursor.fetchone()['total']
    
    cursor.execute("SELECT AVG(trustScore) as avg FROM influencers")
    avg_score = cursor.fetchone()['avg']
    
    conn.close()
    
    return {
        "success": True,
        "data": {
            "totalInfluencers": total,
            "avgTrustScore": avg_score
        }
    }

@app.get("/api/public/search")
async def search_influencers(q: str):
    conn = get_db()
    cursor = conn.cursor()
    
    query = "SELECT * FROM influencers WHERE name LIKE ? LIMIT 20"
    cursor.execute(query, (f"%{q}%",))
    rows = cursor.fetchall()
    
    influencers = [dict(row) for row in rows]
    conn.close()
    
    return {"success": True, "data": influencers}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
```

### 3. Run the API Server
```bash
python api_server.py
```

Or with uvicorn directly:
```bash
uvicorn api_server:app --reload --port 3000
```

## Testing the Setup

### 1. Test Backend API
```bash
# Test influencers endpoint
curl http://localhost:3000/api/public/influencers?limit=5

# Test stats endpoint
curl http://localhost:3000/api/public/stats

# Test search endpoint
curl "http://localhost:3000/api/public/search?q=test"
```

### 2. Test Frontend Connection
1. Open http://localhost:3002 in your browser
2. Open browser console (F12)
3. Check for API requests to `localhost:3000`
4. Verify data loads correctly

## Troubleshooting

### Backend Issues

**Port Already in Use**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Database Not Found**
```bash
# Check if database exists
ls -la influencer_monitor.db

# If missing, you may need to initialize it
python database.py
```

**Module Not Found**
```bash
# Ensure virtual environment is activated
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt
```

### Frontend Issues

**CORS Errors**
- Ensure backend has CORS middleware enabled
- Check that `Access-Control-Allow-Origin: *` header is present

**Connection Refused**
- Verify backend is running on port 3000
- Check firewall settings
- Try `http://127.0.0.1:3000` instead of `localhost`

**Environment Variable Not Loading**
```bash
# Restart Next.js dev server after changing .env.local
npm run dev
```

## Running Both Frontend and Backend

### Terminal 1: Backend
```bash
cd /Users/roane/roane/perso/hack-the-gap
source venv/bin/activate
python api_server.py  # or your backend command
```

### Terminal 2: Frontend
```bash
cd /Users/roane/roane/perso/hack-the-gap/influencer-app
npm run dev
```

### Access
- **Frontend**: http://localhost:3002
- **Backend API**: http://localhost:3000
- **API Docs** (if FastAPI): http://localhost:3000/docs

## Production Considerations

### Using Docker
Create `docker-compose.yml` in the root:
```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - ./influencer_monitor.db:/app/influencer_monitor.db
  
  frontend:
    build: ./influencer-app
    ports:
      - "3002:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=http://backend:3000/api/public
    depends_on:
      - backend
```

### Using PM2 (Process Manager)
```bash
# Install PM2
npm install -g pm2

# Start backend
pm2 start api_server.py --name backend --interpreter python3

# Start frontend
cd influencer-app
pm2 start npm --name frontend -- start

# View logs
pm2 logs

# Stop all
pm2 stop all
```

## Next Steps

1. **Identify your backend server type** (Flask, FastAPI, Streamlit, etc.)
2. **Start the backend** on port 3000
3. **Update `.env.local`** to point to `http://localhost:3000/api/public`
4. **Restart frontend** with `npm run dev`
5. **Test the connection** by loading the dashboard

## Need Help?

If you're unsure about your backend setup:
1. Check `orchestrator.py` - it might be the main entry point
2. Look for `app.py`, `main.py`, or `server.py`
3. Check `requirements.txt` for web frameworks (Flask, FastAPI, Django)
4. Run `python orchestrator.py --help` for usage information
