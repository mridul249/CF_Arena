import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { TrendingUp, Trophy, Flame } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, dailyQuestion } = useAppContext();

  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading user data...</div>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Dashboard</h1>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.1)' }}>
            <TrendingUp size={24} color="var(--primary-color)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Current Rating</p>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{user.rating}</h2>
          </div>
        </Card>
        
        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
            <Trophy size={24} color="var(--warning-color)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Max Rating</p>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{user.max_rating}</h2>
          </div>
        </Card>

        <Card style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}>
            <Flame size={24} color="var(--danger-color)" />
          </div>
          <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>Current Streak</p>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{user.streak} days</h2>
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        {/* Chart */}
        <Card style={{ height: '400px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Rating Progress</h3>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={user.rating_history} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--card-color)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                  itemStyle={{ color: 'var(--text-primary)' }}
                />
                <Line type="monotone" dataKey="rating" stroke="var(--primary-color)" strokeWidth={3} dot={{ fill: 'var(--primary-color)', strokeWidth: 2 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Today's Question */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h3>Today's Question</h3>
          <div>
            <p style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '0.5rem' }}>{dailyQuestion.name}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Badge variant="warning">Rating: {dailyQuestion.difficulty}</Badge>
              {dailyQuestion.tags.slice(0, 2).map((tag, idx) => (
                <Badge key={idx} variant="primary">{tag}</Badge>
              ))}
            </div>
          </div>
          <Button 
            variant="primary" 
            onClick={() => window.open(dailyQuestion.link, '_blank')}
            style={{ width: '100%', marginTop: 'auto' }}
          >
            Solve on Codeforces
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
