import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAppContext();

  // If there's no user, we might be on the login page; don't show the nav links
  if (!user) return null;

  const links = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Daily Question', path: '/daily' },
    { name: 'Leaderboard', path: '/leaderboard' },
    { name: 'Profile', path: '/profile' },
  ];

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      height: 'var(--navbar-height)',
      backgroundColor: 'rgba(15, 23, 42, 0.7)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50
    }}>
      <div style={{
        width: 'var(--container-width)',
        maxWidth: '100%',
        padding: '0 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-primary)' }}>
          <Trophy size={24} color="var(--primary-color)" />
          <span style={{ fontSize: '1.25rem', fontWeight: 'bold', letterSpacing: '-0.025em' }}>CF Arena</span>
        </Link>
        
        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {links.map(link => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.path} 
                to={link.path}
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: isActive ? '600' : '500',
                  fontSize: '0.9rem',
                }}
              >
                {link.name}
              </Link>
            );
          })}
          <button 
            onClick={() => {
              logout();
              navigate('/login');
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              fontWeight: '500',
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};
