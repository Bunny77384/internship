import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
// import InternshipForm from './pages/InternshipForm'; // Replaced by EnhancedInternshipForm
import EnhancedInternshipForm from './components/EnhancedInternshipForm';
import UploadFiles from './pages/UploadFiles';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/add" element={
            <ProtectedRoute>
              <EnhancedInternshipForm />
            </ProtectedRoute>
          } />
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EnhancedInternshipForm />
            </ProtectedRoute>
          } />
          <Route path="/files" element={
            <ProtectedRoute>
              <UploadFiles />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
