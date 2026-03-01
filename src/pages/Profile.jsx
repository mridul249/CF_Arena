import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Avatar } from '../components/Avatar';
import { Table } from '../components/Table';
import { Badge } from '../components/Badge';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

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

  // Analyze tags to build radar chart data
  const tagCategories = {
    'Math': ['math', 'number theory', 'combinatorics', 'probabilities', 'geometry'],
    'DP': ['dp', 'bitmasks'],
    'Graphs': ['graphs', 'dfs and similar', 'shortest paths', 'trees', 'dsu'],
    'Data Structures': ['data structures', 'binary search'],
    'Strings': ['strings', 'string suffix structures'],
    'Greedy': ['greedy', 'constructive algorithms', 'sortings']
  };

  const radarData = Object.keys(tagCategories).map(cat => ({
    subject: cat,
    A: 0,
    fullMark: 100
  }));

  user.recent_submissions.forEach(sub => {
    if (sub.verdict === 'Accepted' && sub.tags) {
       sub.tags.forEach(tag => {
          radarData.forEach(r => {
            if (tagCategories[r.subject].includes(tag.toLowerCase())) {
              r.A += 1;
            }
          });
       });
    }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      
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

      {/* Secondary Content: Submissions & Radar Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Recent Submissions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0 }}>Recent Submissions</h3>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <Table 
              columns={['Problem', 'Verdict', 'Time']} 
              data={formattedSubmissions} 
            />
          </Card>
        </div>

        {/* Strengths Radar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <h3 style={{ margin: 0 }}>Strengths Comparison</h3>
           <Card style={{ padding: '2rem', height: '350px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <div style={{ flex: 1, width: '100%', minHeight: 0 }}>
               <ResponsiveContainer width="100%" height="100%">
                 <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                   <PolarGrid stroke="rgba(255,255,255,0.1)" />
                   <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} />
                   <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} stroke="transparent" />
                   <Radar name={user.name} dataKey="A" stroke="var(--primary-color)" fill="var(--primary-color)" fillOpacity={0.5} />
                 </RadarChart>
               </ResponsiveContainer>
             </div>
           </Card>
        </div>

      </div>

    </div>
  );
};

export default Profile;
