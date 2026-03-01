import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  };

  const variants = {
    primary: {
      backgroundColor: 'rgba(99, 102, 241, 0.2)',
      color: 'var(--primary-color)',
    },
    success: {
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      color: 'var(--success-color)',
    },
    danger: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
      color: 'var(--danger-color)',
    },
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.2)',
      color: 'var(--warning-color)',
    }
  };

  return (
    <span style={{ ...baseStyles, ...variants[variant] }} className={className}>
      {children}
    </span>
  );
};
