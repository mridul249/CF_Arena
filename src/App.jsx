import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';

// Placeholder imports for pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyQuestion from './pages/DailyQuestion';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import Cookies from 'js-cookie';

function App() {
  return (
    <>
      <Navbar />
      <main style={{
        width: 'var(--container-width)',
        maxWidth: '100%',
        margin: '0 auto',
        padding: '2rem 1rem',
      }}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={
             Cookies.get('cf_active_handle') ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/daily" element={
            <ProtectedRoute>
              <DailyQuestion />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}

export default App;
