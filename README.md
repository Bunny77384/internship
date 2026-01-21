# 🚀 InternTracker - Professional Internship Management System

InternTracker is a full-stack MERN application designed for students and job seekers to organize their internship hunt. It provides a clean, modern interface to track applications, upload documents, and receive notifications on status updates.

## ✨ Features

- **🔐 Secure Authentication**: JWT-based login and registration with password hashing.
- **📊 Real-time Dashboard**: Visual statistics of your application journey.
- **📝 Application Tracking**: Full CRUD (Create, Read, Update, Delete) for your internship applications.
- **📤 Document Management**: Centralized storage for resumes and cover letters using Multer.
- **🔔 In-app Notifications**: Get alerted when you update an application's status.
- **💎 Premium Design**: Modern glassmorphism UI built with vanilla CSS.

## 🛠️ Tech Stack

- **Frontend**: React.js
- **Backend**: Node.js & Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: bcryptjs & JSON Web Tokens (JWT)
- **File Storage**: Local storage (Multer)

## 🚀 Quick Start

### 1. Prerequisite
- Node.js installed on your system.
- A MongoDB connection string (from MongoDB Atlas).

### 2. Backend Setup
1. Navigate to the backend folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update `.env` with your actual MongoDB URI:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_random_secret_key
   PORT=5000
   ```
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```

## 📂 Project Structure

```
internship-tracker/
├── backend/            # Express Server, MongoDB Models, JWT Auth
└── frontend/           # React App, Axios Services, Modern UI
```

---
Built with ❤️ by InternTracker Team
