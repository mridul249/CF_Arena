import React from 'react';

export const Table = ({ columns, data, className = '' }) => {
  return (
    <div style={{ overflowX: 'auto', width: '100%' }} className={className}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                style={{ 
                  padding: '1rem', 
                  color: 'var(--text-secondary)', 
                  fontWeight: '600', 
                  fontSize: '0.875rem' 
                }}
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr 
              key={rowIdx} 
              style={{ 
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              {Object.values(row).map((val, colIdx) => (
                <td 
                  key={colIdx} 
                  style={{ 
                    padding: '1rem', 
                    color: 'var(--text-primary)',
                    fontSize: '0.875rem' 
                  }}
                >
                  {val}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
