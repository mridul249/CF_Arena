import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';

// Placeholder imports for pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DailyQuestion from './pages/DailyQuestion';
import Leaderboard from './pages/Leaderboard';
import Profile from './pages/Profile';

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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/daily" element={<DailyQuestion />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
