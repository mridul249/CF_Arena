import React from 'react';

export const Input = ({ label, id, ...props }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginBottom: '1rem' }}>
      {label && (
        <label htmlFor={id} style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: '500' }}>
          {label}
        </label>
      )}
      <input
        id={id}
        style={{
          width: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '0.5rem',
          backgroundColor: 'rgba(15, 23, 42, 0.5)', /* slightly darker than card */
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'var(--text-primary)',
          outline: 'none',
          transition: 'border-color 0.2s',
          fontFamily: 'inherit'
        }}
        onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
        onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'}
        {...props}
      />
    </div>
  );
};
