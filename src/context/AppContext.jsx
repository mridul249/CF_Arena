import React, { createContext, useContext, useState, useEffect } from 'react';
import { codeforcesAPI } from '../api/codeforces';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Store the logged in user handle. We persist this session.
  const [activeHandle, setActiveHandle] = useState(() => localStorage.getItem('cf_active_handle') || null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Tracked users on the leaderboard.
  const [trackedHandles, setTrackedHandles] = useState(() => {
    const saved = localStorage.getItem('cf_tracked_handles');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Live Leaderboard Data fetched from CF
  const [leaderboard, setLeaderboard] = useState([]);

  // Manually entered Daily Question
  const [dailyQuestion, setDailyQuestion] = useState(() => {
    const saved = localStorage.getItem('cf_daily_question');
    return saved ? JSON.parse(saved) : {
      name: 'No Question Set',
      difficulty: 'N/A',
      tags: [],
      link: '#'
    };
  });

  const [dailyActivity, setDailyActivity] = useState(() => {
    const saved = localStorage.getItem('cf_daily_activity');
    return saved ? JSON.parse(saved) : [];
  });

  // Watch for handle change, fetch profile if logged in
  useEffect(() => {
    if (activeHandle) {
      localStorage.setItem('cf_active_handle', activeHandle);
      
      // Auto-add the logged-in user to tracked users if not present
      if (!trackedHandles.includes(activeHandle.toLowerCase())) {
         const newTracked = [...trackedHandles, activeHandle.toLowerCase()];
         setTrackedHandles(newTracked);
         localStorage.setItem('cf_tracked_handles', JSON.stringify(newTracked));
      }

      fetchUserProfile(activeHandle);
    } else {
      localStorage.removeItem('cf_active_handle');
      setUserProfile(null);
    }
  }, [activeHandle]);

  // Save daily question
  useEffect(() => {
    localStorage.setItem('cf_daily_question', JSON.stringify(dailyQuestion));
  }, [dailyQuestion]);

  // Save daily activity
  useEffect(() => {
    localStorage.setItem('cf_daily_activity', JSON.stringify(dailyActivity));
  }, [dailyActivity]);

  const fetchUserProfile = async (handle) => {
    try {
      const info = await codeforcesAPI.getUserInfo(handle);
      const ratingHistory = await codeforcesAPI.getUserRatingHistory(handle);
      const status = await codeforcesAPI.getUserStatus(handle, 20); // Fetch recent submissions
      
      const cfUser = info[0];
      
      // Calculate streak logic (simplified: count recent consec days solved)
      // This requires processing status to find unique AC days, setting to mock 0 for now
      
      setUserProfile({
        name: cfUser.firstName ? `${cfUser.firstName} ${cfUser.lastName || ''}` : handle,
        cf_handle: handle,
        rating: cfUser.rating || 0,
        max_rating: cfUser.maxRating || 0,
        streak: 0, 
        total_solved: new Set(status.filter(s => s.verdict === 'OK').map(s => s.problem.name)).size, 
        avatar: cfUser.titlePhoto,
        rating_history: ratingHistory.map(r => ({
           date: new Date(r.ratingUpdateTimeSeconds * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
           rating: r.newRating
        })),
        recent_submissions: status.slice(0, 10).map(s => ({
          problem: s.problem.name,
          verdict: s.verdict === 'OK' ? 'Accepted' : (s.verdict === 'WRONG_ANSWER' ? 'Wrong Answer' : s.verdict),
          time: new Date(s.creationTimeSeconds * 1000).toLocaleString()
        }))
      });
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  const fetchLeaderboard = async () => {
    if (trackedHandles.length === 0) return;
    
    try {
      const handlesString = trackedHandles.join(';');
      const usersInfo = await codeforcesAPI.getUserInfo(handlesString);
      
      const newLeaderboard = usersInfo.map(u => ({
         name: u.handle,
         rating: u.rating || 0,
         weekly_solved: 0, // Requires complex API analysis of status, leaving 0 for MVP
         streak: 0 // Requires complex API analysis of status, leaving 0 for MVP
      }));
      
      setLeaderboard(newLeaderboard);
    } catch (e) {
      console.error("Failed to fetch leaderboard", e);
    }
  };

  // Re-fetch leaderboard periodically or when tracked users change
  useEffect(() => {
    fetchLeaderboard();
  }, [trackedHandles]);

  const login = async (handle) => {
     try {
       // Just verify it exists
       await codeforcesAPI.getUserInfo(handle);
       setActiveHandle(handle);
       return true;
     } catch (e) {
       console.error(e);
       return false;
     }
  };

  const logout = () => {
    setActiveHandle(null);
  };

  return (
    <AppContext.Provider value={{
      activeHandle,
      user: userProfile, 
      login, logout,
      dailyQuestion, setDailyQuestion,
      dailyActivity, setDailyActivity,
      leaderboard, setLeaderboard,
      trackedHandles, setTrackedHandles
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
