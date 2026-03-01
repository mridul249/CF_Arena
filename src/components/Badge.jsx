import React from 'react';

export const Badge = ({ children, variant = 'primary', className = '' }) => {
  const baseStyles = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.25rem 0.5rem',
    borderRadius: '6px',
    fontSize: '0.7rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    border: '1px solid transparent'
  };

  const variants = {
    primary: {
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      color: 'var(--primary-color)',
      borderColor: 'rgba(99, 102, 241, 0.3)'
    },
    success: {
      backgroundColor: 'rgba(34, 197, 94, 0.1)',
      color: 'var(--success-color)',
      borderColor: 'rgba(34, 197, 94, 0.3)'
    },
    danger: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: 'var(--danger-color)',
      borderColor: 'rgba(239, 68, 68, 0.3)'
    },
    warning: {
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      color: 'var(--warning-color)',
      borderColor: 'rgba(245, 158, 11, 0.3)'
    }
  };

  return (
    <span style={{ ...baseStyles, ...variants[variant] }} className={className}>
      {children}
    </span>
  );
};
