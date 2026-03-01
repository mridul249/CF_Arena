import React from 'react';

export const Avatar = ({ src, alt = 'Avatar', size = 48, className = '' }) => {
  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        backgroundColor: 'var(--card-color)'
      }}
    >
      {src ? (
        <img 
          src={src} 
          alt={alt} 
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
      ) : (
        <div style={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: size * 0.4,
          fontWeight: 'bold'
        }}>
          {alt.charAt(0).toUpperCase()}
        </div>
      )}
    </div>
  );
};
