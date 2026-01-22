# Deployment Guide: MERN Stack

This guide details the steps to deploy your Internship Tracker application.
- **Frontend**: Deployed to **Vercel**.
- **Backend**: Deployed to **Render**.
- **Database**: Hosted on **MongoDB Atlas**.

---

## Prerequisite: GitHub
Your code is already pushed to: [https://github.com/Bunny77384/internship](https://github.com/Bunny77384/internship).
Ensure you are logged into your GitHub account.

---

## Phase 1: Database Setup (MongoDB Atlas)

1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up/login.
2.  **Create a Cluster**:
    *   Click **+ Create** or **Build a Database**.
    *   Select **M0 Sandbox** (Free Tier).
    *   Select a region close to you (e.g., AWS / N. Virginia or Mumbai).
    *   Click **Create**.
3.  **Create Database User**:
    *   Go to **Database Access** (sidebar).
    *   Click **+ Add New Database User**.
    *   Username: `admin` (or your choice).
    *   Password: Create a strong password (write it down!).
    *   Role: **Read and write to any database**.
    *   Click **Add User**.
4.  **Network Access (Allow Connections)**:
    *   Go to **Network Access** (sidebar).
    *   Click **+ Add IP Address**.
    *   Select **Allow Access From Anywhere** (`0.0.0.0/0`).
    *   Click **Confirm**.
5.  **Get Connection String**:
    *   Go to **Database** (sidebar).
    *   Click **Connect** on your cluster.
    *   Select **Drivers** (Node.js).
    *   Copy the connection string. It looks like:
        `mongodb+srv://admin:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority`
    *   **Replace `<password>`** with the password you created in step 3. keep this string safe.

---

## Phase 2: Backend Deployment (Render)

1.  Go to [Render.com](https://render.com/) and sign up/login with GitHub.
2.  Click **New +** -> **Web Service**.
3.  Select **Build and deploy from a Git repository**.
4.  Select your `internship` repository.
5.  **Configuration**:
    *   **Name**: `internship-backend` (or similar).
    *   **Region**: Same as MongoDB (optional, but good for speed).
    *   **Branch**: `main`.
    *   **Root Directory**: `backend` (Important!).
    *   **Runtime**: **Node** (20 or latest LTS).
    *   **Build Command**: `npm install`.
    *   **Start Command**: `node server.js`.
    *   **Instance Type**: **Free**.
6.  **Environment Variables**:
    *   Scroll down to **Environment Variables**.
    *   Add the following:
        *   `MONGODB_URI`: Paste your MongoDB connection string from Phase 1.
        *   `JWT_SECRET`: Enter a long random string (e.g., `mysecretkey12345`).
        *   `NODE_ENV`: `production`.
7.  Click **Create Web Service**.
8.  Wait for the deployment to finish. Once "Live", copy the **backend URL** from the top left (e.g., `https://internship-backend.onrender.com`).

> **Important Note**: On Render's Free Tier, uploaded files (resumes/images) are stored temporarily. If the server restarts (which happens after inactivity), **uploaded files will be lost**. For a real production app, you should update the backend to store files in AWS S3 or Cloudinary.

(Note: The backend may take a minute to start up on the free tier).

---

## Phase 3: Frontend Deployment (Vercel)

1.  Go to [Vercel.com](https://vercel.com/) and sign up/login with GitHub.
2.  Click **Add New ...** -> **Project**.
3.  Import your `internship` repository.
4.  **Configure Project**:
    *   **Framework Preset**: Create React App (should be auto-detected).
    *   **Root Directory**: **Edit** this and select `frontend`.
5.  **Environment Variables**:
    *   Expand the **Environment Variables** section.
    *   Add:
        *   **Key**: `REACT_APP_API_URL`
        *   **Value**: Your Render Backend URL (from Phase 2). **Do not add a trailing slash** (e.g., `https://internship-backend.onrender.com`).
6.  Click **Deploy**.
7.  Vercel will build and deploy your frontend.
8.  Once complete, you will get a dashboard link to your live site!

---

## Verification

1.  Open your Vercel URL.
2.  Try to Sign Up/Login.
3.  Upload a file or test a backend feature to ensure the connection works.
