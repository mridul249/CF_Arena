import React from 'react';

export const Card = ({ children, className = '', style, onClick }) => {
  return (
    <div 
      className={`custom-card ${className}`}
      onClick={onClick}
      style={{
        backgroundColor: 'var(--card-color)',
        borderRadius: 'var(--card-radius)',
        padding: 'var(--spacing-unit)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(10px)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        ...style
      }}
    >
      {children}
    </div>
  );
};
