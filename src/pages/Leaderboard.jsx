import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Tabs } from '../components/Tabs';
import { Table } from '../components/Table';
import { Trophy, Flame, Target } from 'lucide-react';

const Leaderboard = () => {
  const { leaderboard, trackedHandles } = useAppContext();
  const [activeTab, setActiveTab] = React.useState(0);

  if (trackedHandles.length > 0 && leaderboard.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Fetching live rankings from Codeforces...</div>;
  }

  const tabs = ["Rating", "Weekly Solved", "Streak"];

  const getSortedData = () => {
    let sorted = [...leaderboard];
    if (activeTab === 0) {
      sorted.sort((a, b) => b.rating - a.rating);
    } else if (activeTab === 1) {
      sorted.sort((a, b) => b.weekly_solved - a.weekly_solved);
    } else if (activeTab === 2) {
      sorted.sort((a, b) => b.streak - a.streak);
    }
    
    return sorted.map((user, index) => ({
      Rank: `#${index + 1}`,
      Name: user.name,
      Rating: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === 0 ? 'bold' : 'normal', color: activeTab === 0 ? 'var(--primary-color)' : 'inherit' }}>
          <Trophy size={16} color={activeTab === 0 ? 'var(--primary-color)' : 'var(--text-secondary)'} /> {user.rating}
        </span>
      ),
      'Weekly Solved': (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === 1 ? 'bold' : 'normal', color: activeTab === 1 ? 'var(--success-color)' : 'inherit' }}>
          <Target size={16} color={activeTab === 1 ? 'var(--success-color)' : 'var(--text-secondary)'} /> {user.weekly_solved}
        </span>
      ),
      Streak: (
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: activeTab === 2 ? 'bold' : 'normal', color: activeTab === 2 ? 'var(--danger-color)' : 'inherit' }}>
          <Flame size={16} color={activeTab === 2 ? 'var(--danger-color)' : 'var(--text-secondary)'} /> {user.streak}
        </span>
      )
    }));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Arena Leaderboard</h1>
      
      <Tabs tabs={tabs} onChange={setActiveTab} />
      
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Table 
          columns={['Rank', 'Name', 'Rating', 'Weekly Solved', 'Streak']} 
          data={getSortedData()} 
        />
      </Card>
    </div>
  );
};

export default Leaderboard;
