---
description: how to set up the project in a new environment
---

# 🛠️ FreshKart Project Setup Guide

Follow these steps to get the **FreshKart** platform running on your local machine using VS Code.

## 1. Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Version 16 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) (Running on localhost:27017)
- [VS Code](https://code.visualstudio.com/)

## 2. Install Project Dependencies
The project is split into a **Frontend** and a **Backend**. You need to install packages for both. Open your terminal in the root folder and run:

```bash
# Install root dependencies (like concurrently)
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

## 3. Configure Environment Variables
Create a file named `.env` inside the `backend/` folder and add these details:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/freshkart
JWT_SECRET=your_super_secret_key_123
# For Real Emails (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## 4. Seed the Database
To get the initial products and categories into your store, run the seeder command:

```bash
# In the root directory
npm run seed
```

## 5. Run the Application
You can run both the frontend and backend with a single command from the root folder:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 6. Troubleshooting
- **Images not loading?** Ensure the `frontend/public/` folder contains your logo and hero images.
- **Port Conflict?** If port 5000 or 5173 is busy, close any other terminal windows or change the ports in `.env` and `vite.config.js`.
