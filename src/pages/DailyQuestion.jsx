import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { ExternalLink, CheckCircle, Clock, XCircle } from 'lucide-react';

const DailyQuestion = () => {
  const { dailyQuestion, setDailyQuestion, dailyActivity, setDailyActivity, user } = useAppContext();
  const [isEditing, setIsEditing] = React.useState(false);
  const [editForm, setEditForm] = React.useState({
    name: dailyQuestion.name,
    difficulty: dailyQuestion.difficulty,
    tags: dailyQuestion.tags.join(', '),
    link: dailyQuestion.link
  });

  const handleUpdateQuestion = (e) => {
    e.preventDefault();
    setDailyQuestion({
      name: editForm.name,
      difficulty: editForm.difficulty,
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      link: editForm.link
    });
    // optionally reset daily activity on daily question change? 
    // setDailyActivity([]);
    setIsEditing(false);
  };

  const markStatus = (status, variant) => {
    // Generate current time string (mock)
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if user already marked
    const existingIndex = dailyActivity.findIndex(a => a.name === user.name);
    
    const newActivity = [...dailyActivity];
    const update = { name: user.name, status: status, time: timeString };

    if (existingIndex >= 0) {
      newActivity[existingIndex] = update;
    } else {
      newActivity.unshift(update);
    }
    
    setDailyActivity(newActivity);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Daily Question</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Question Details */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{dailyQuestion.name}</h2>
             <Button variant="outline" onClick={() => setIsEditing(!isEditing)} style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>
               {isEditing ? 'Cancel' : 'Edit Question'}
             </Button>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input 
                placeholder="Question Name" 
                value={editForm.name} 
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                required 
              />
              <input 
                placeholder="Difficulty (e.g. 1200)" 
                value={editForm.difficulty} 
                onChange={(e) => setEditForm({...editForm, difficulty: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} 
              />
              <input 
                placeholder="Tags (comma separated)" 
                value={editForm.tags} 
                onChange={(e) => setEditForm({...editForm, tags: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} 
              />
              <input 
                type="url"
                placeholder="Problem Link" 
                value={editForm.link} 
                onChange={(e) => setEditForm({...editForm, link: e.target.value})}
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}
                required 
              />
              <Button type="submit" variant="primary">Save new Question</Button>
            </form>
          ) : (
            <>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                <Badge variant="warning">Rating: {dailyQuestion.difficulty}</Badge>
                {dailyQuestion.tags.map((tag, idx) => (
                  <Badge key={idx} variant="primary">{tag}</Badge>
                ))}
              </div>
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
                <Button 
                  variant="outline" 
                  onClick={() => window.open(dailyQuestion.link, '_blank')}
                  disabled={dailyQuestion.link === '#'}
                >
                  Open on Codeforces <ExternalLink size={18} />
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Mark Status */}
        <Card style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0 }}>Mark Your Status</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Update your progress for today's question. This will be visible on the leaderboard.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <Button variant="success" onClick={() => markStatus('Solved ✅', 'success')} style={{ justifyContent: 'space-between' }}>
              <span>Solved</span> <CheckCircle size={20} />
            </Button>
            <Button variant="warning" onClick={() => markStatus('Attempted ⏳', 'warning')} style={{ justifyContent: 'space-between' }}>
              <span>Attempted</span> <Clock size={20} />
            </Button>
            <Button variant="danger" onClick={() => markStatus('Didn’t Try ❌', 'danger')} style={{ justifyContent: 'space-between' }}>
              <span>Didn’t Try</span> <XCircle size={20} />
            </Button>
          </div>
        </Card>
      </div>

      {/* Activity Table */}
      <h3 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Today's Activity</h3>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <Table 
          columns={['Name', 'Status', 'Time Marked']} 
          data={dailyActivity} 
        />
      </Card>
    </div>
  );
};

export default DailyQuestion;
