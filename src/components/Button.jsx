import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary-color)',
      color: '#ffffff',
    },
    success: {
      backgroundColor: 'var(--success-color)',
      color: '#ffffff',
    },
    danger: {
      backgroundColor: 'var(--danger-color)',
      color: '#ffffff',
    },
    warning: {
      backgroundColor: 'var(--warning-color)',
      color: '#ffffff',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--text-secondary)',
      color: 'var(--text-primary)',
    }
  };

  return (
    <button 
      style={{ ...baseStyles, ...variants[variant] }}
      className={`custom-button ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
