import React, { useState } from 'react';

export const Tabs = ({ tabs, defaultTab = 0, onChange, className = '' }) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabClick = (index) => {
    setActiveTab(index);
    if (onChange) onChange(index);
  };

  return (
    <div 
      className={className} 
      style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        overflowX: 'auto',
        marginBottom: '1rem'
      }}
    >
      {tabs.map((tab, idx) => {
        const isActive = activeTab === idx;
        return (
          <button
            key={idx}
            onClick={() => handleTabClick(idx)}
            style={{
              padding: '0.75rem 1rem',
              color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: isActive ? '600' : '500',
              borderBottom: isActive ? '2px solid var(--primary-color)' : '2px solid transparent',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!isActive) e.target.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.target.style.color = 'var(--text-secondary)';
            }}
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
