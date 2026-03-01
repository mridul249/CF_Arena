import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';

const Profile = () => {
  const { user } = useAppContext();

  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading profile data...</div>;
  }

  const getVerdictBadge = (verdict) => {
    if (verdict === 'Accepted') return <Badge variant="success">Accepted</Badge>;
    if (verdict === 'Wrong Answer') return <Badge variant="danger">Wrong Answer</Badge>;
    return <Badge variant="warning">{verdict}</Badge>;
  };

  const formattedSubmissions = user.recent_submissions.map(sub => ({
    Problem: sub.problem,
    Verdict: getVerdictBadge(sub.verdict),
    Time: sub.time
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Bio / Header */}
      <Card style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '2.5rem' }}>
        <Avatar src={user.avatar} size={100} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <h1 style={{ fontSize: '2rem', margin: 0 }}>{user.name}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', margin: 0 }}>
            @{user.cf_handle}
          </p>
        </div>
      </Card>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Current Rating</p>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--primary-color)' }}>{user.rating}</h2>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Max Rating</p>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--warning-color)' }}>{user.max_rating}</h2>
        </Card>
        <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Solved</p>
          <h2 style={{ fontSize: '2rem', margin: 0, color: 'var(--success-color)' }}>{user.total_solved}</h2>
        </Card>
      </div>

      {/* Recent Submissions */}
      <div>
        <h3 style={{ marginBottom: '1rem', marginTop: '1rem' }}>Recent Submissions</h3>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <Table 
            columns={['Problem', 'Verdict', 'Time']} 
            data={formattedSubmissions} 
          />
        </Card>
      </div>

    </div>
  );
};

export default Profile;
