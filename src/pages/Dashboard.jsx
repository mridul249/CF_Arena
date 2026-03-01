import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { TrendingUp, Trophy, Flame, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user, dailyQuestion, upcomingContests, socialFeed, leaderboard } = useAppContext();

  if (!user) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>Loading user data...</div>;
  }

  // Helper to format remaining time
  const formatRemainingTime = (seconds) => {
    if (seconds <= 0) return 'Started';
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    if (days > 0) return `${days} day(s), ${hours} hours`;
    return `${hours} hours`;
  };

  // Helper to get time ago string for feed
  const getTimeAgo = (timestampSeconds) => {
     const diffMs = Date.now() - timestampSeconds * 1000;
     const diffHours = Math.floor(diffMs / 3600000);
     if (diffHours < 24) return `${diffHours} hours ago`;
     return `${Math.floor(diffHours / 24)} days ago`;
  };

  // Get top 5 friends
  const topFriends = [...leaderboard].sort((a,b) => b.rating - a.rating).slice(0, 5);

  return (
    <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
      
      {/* Left Column (Main Content) */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Daily Challenge Card - New Layout */}
        <Card style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Badge variant="primary" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.6rem' }}>
               <Flame size={14} /> DAILY CHALLENGE
            </Badge>
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
            {dailyQuestion.name}
          </h2>
          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={16} /> Difficulty: {dailyQuestion.difficulty}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              # Tags: {dailyQuestion.tags.slice(0, 2).join(', ')}
            </span>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button variant="primary" onClick={() => window.open(dailyQuestion.link, '_blank')}>
              Solve Now
            </Button>
            <Button variant="outline" onClick={() => window.open(dailyQuestion.link, '_blank')}>
              View Problem Set <Target size={16} style={{ marginLeft: '0.5rem' }}/>
            </Button>
          </div>
        </Card>

        {/* Activity Progress Chart */}
        <Card style={{ height: '350px', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Activity Progress (Rating)</h3>
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

        {/* Social Activity Feed */}
        <div>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
             <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Social Activity</h3>
             <a href="#" style={{ color: 'var(--primary-color)', fontSize: '0.9rem', textDecoration: 'none' }}>View All</a>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
             {socialFeed.length > 0 ? socialFeed.map((activity, idx) => (
                <Card key={idx} style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ 
                    width: '40px', height: '40px', borderRadius: '50%', 
                    backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 'bold' 
                  }}>
                    {activity.handle.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1 }}>
                     <p style={{ margin: '0 0 0.25rem 0' }}>
                       <strong>{activity.handle}</strong> {activity.verdict === 'OK' ? 'solved' : 'attempted'} rated <strong>{activity.rating}</strong>
                     </p>
                     <p style={{ margin: 0, color: 'var(--primary-color)', fontWeight: '500' }}>
                       {activity.problem}
                     </p>
                     <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                       {getTimeAgo(activity.timeSeconds)}
                     </p>
                  </div>
                  {activity.verdict === 'OK' && <Badge variant="success">AC</Badge>}
                </Card>
             )) : (
                <Card><p style={{ margin: 0, color: 'var(--text-secondary)' }}>No recent activity to show.</p></Card>
             )}
           </div>
        </div>

      </div>

      {/* Right Column (Sidebar) */}
      <div style={{ width: '350px', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Friends */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
           <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>Top Friends</h3>
           {topFriends.length > 0 ? topFriends.map((friend, idx) => (
             <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: idx < topFriends.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <div style={{ 
                     width: '32px', height: '32px', borderRadius: '50%', 
                     backgroundColor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem'
                   }}>
                     {friend.name.charAt(0).toUpperCase()}
                   </div>
                   <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '500' }}>{friend.name}</span>
                   </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                   <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{friend.rating}</span>
                   <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>pts</span>
                </div>
             </div>
           )) : (
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Fetching leaderboard data...</p>
           )}
           <Button variant="outline" style={{ marginTop: '0.5rem' }} onClick={() => window.location.href='/leaderboard'}>
             Compare Performance
           </Button>
        </Card>

        {/* Next Contest */}
        <Card style={{ backgroundColor: 'var(--primary-color)', color: 'white', padding: '2rem' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', opacity: 0.9 }}>
              <TrendingUp size={18} /> <span style={{ fontWeight: '500' }}>Next Contest</span>
           </div>
           
           {upcomingContests.length > 0 ? (
             <>
               <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', lineHeight: '1.4' }}>
                 {upcomingContests[0].name}
               </h3>
               <p style={{ margin: '0 0 1.5rem 0', opacity: 0.8, fontSize: '0.9rem' }}>
                 Starts in {formatRemainingTime(upcomingContests[0].relativeTimeSeconds * -1)}
               </p>
               <Button style={{ backgroundColor: 'white', color: 'var(--primary-color)', width: '100%', fontWeight: '600' }} onClick={() => window.open('https://codeforces.com/contests', '_blank')}>
                 Set Reminder
               </Button>
             </>
           ) : (
             <p>Loading contests...</p>
           )}
        </Card>

      </div>

    </div>
  );
};

export default Dashboard;
