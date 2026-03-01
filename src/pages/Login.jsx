import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Trophy } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAppContext();
  const [handle, setHandle] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!handle) return;
    
    setLoading(true);
    setError('');
    const success = await login(handle);
    setLoading(false);
    
    if (success) {
      // clear daily activity if this is a fresh manual login? optionally
      navigate('/dashboard');
    } else {
      setError('Invalid Codeforces Handle or API error. Please try again.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 120px)'
    }}>
      <Card 
        style={{ 
          width: '400px', 
          padding: '2rem', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '1.5rem',
          textAlign: 'center'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '64px', height: '64px', 
            borderRadius: '50%', 
            backgroundColor: 'rgba(99, 102, 241, 0.1)', 
            display: 'flex', alignItems: 'center', justifyContent: 'center' 
          }}>
            <Trophy size={32} color="var(--primary-color)" />
          </div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>Welcome to CF Arena</h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem' }}>
            Enter your details to continue
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Input 
            label="Codeforces Handle" 
            id="cf_handle" 
            placeholder="e.g. tourist" 
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            required 
          />
          {error && <div style={{ color: 'var(--danger-color)', fontSize: '0.875rem' }}>{error}</div>}
          <Button type="submit" variant="primary" style={{ marginTop: '0.5rem', width: '100%' }} disabled={loading}>
            {loading ? 'Verifying...' : 'Continue'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
