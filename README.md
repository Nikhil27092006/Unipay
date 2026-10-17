# Unipay (CoWallet)

A collaborative group wallet and peer-to-peer payments application built with React + Vite on the frontend and FastAPI on the backend.

---

## 📁 Project Structure

```text
Unipay/
├── Frontend/                 # React + TypeScript + Vite web app
│   ├── src/                  # Components, pages, hooks, styling
│   ├── public/               # Static assets & icons
│   ├── package.json          # Frontend dependencies & scripts
│   ├── vite.config.ts        # Vite configuration
│   └── tsconfig.json         # TypeScript configuration
│
├── Backend/                  # FastAPI Python backend (In progress)
│
├── requirements.txt          # Python backend dependencies
├── .env.example              # Sample environment configuration
├── .env                      # Local environment configuration
├── .gitignore                # Git ignore rules
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### 1. Frontend Setup
```bash
# Navigate to the Frontend directory
cd Frontend

# Install dependencies (if not already installed)
npm install

# Run the local development server
npm run dev
```
The app will be available at `http://localhost:5173`.

### 2. Backend Setup
```bash
# From the root Unipay directory, activate virtual environment
source venv/bin/activate  # On macOS/Linux
# or: .\venv\Scripts\activate on Windows

# Install backend dependencies
pip install -r requirements.txt

# Run backend (once FastAPI app entrypoint is created)
uvicorn main:app --reload --port 8000
```
