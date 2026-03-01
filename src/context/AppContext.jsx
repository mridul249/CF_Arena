import React, { createContext, useContext, useState, useEffect } from 'react';
import { codeforcesAPI } from '../api/codeforces';
import { db } from '../firebase';
import { collection, doc, setDoc, onSnapshot } from 'firebase/firestore';
import Cookies from 'js-cookie';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Store the logged in user handle using Cookies.
  const [activeHandle, setActiveHandle] = useState(() => Cookies.get('cf_active_handle') || null);
  const [userProfile, setUserProfile] = useState(null);
  
  // Tracked users on the leaderboard (synced from Firestore)
  const [trackedHandles, setTrackedHandles] = useState([]);
  
  // Live Leaderboard Data fetched from CF
  const [leaderboard, setLeaderboard] = useState([]);

  // New UI features based on mockups
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [socialFeed, setSocialFeed] = useState([]);

  // Manually entered Daily Question (synced from Firestore)
  const [dailyQuestion, setDailyQuestionState] = useState({
    name: 'Loading...',
    difficulty: 'N/A',
    tags: [],
    link: '#'
  });

  const [dailyActivity, setDailyActivityState] = useState([]);

  // Sync Global Data from Firestore
  useEffect(() => {
    // Listen to all registered users for the global leaderboard
    const unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const handles = snapshot.docs.map(doc => doc.id);
      setTrackedHandles(handles);
    });

    // Listen to daily question
    const unsubscribeDQ = onSnapshot(doc(db, 'app_settings', 'daily_question'), (docSnap) => {
      if (docSnap.exists()) {
        setDailyQuestionState(docSnap.data());
      } else {
        setDailyQuestionState({ name: 'No Question Set', difficulty: 'N/A', tags: [], link: '#' });
      }
    });

    // Listen to daily activity
    const unsubscribeActivity = onSnapshot(doc(db, 'app_settings', 'daily_activity'), (docSnap) => {
      if (docSnap.exists()) {
        setDailyActivityState(docSnap.data().activity || []);
      } else {
        setDailyActivityState([]);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeDQ();
      unsubscribeActivity();
    };
  }, []);

  // Wrappers to update Firestore instead of just local state
  const setDailyQuestion = async (newQuestion) => {
    await setDoc(doc(db, 'app_settings', 'daily_question'), newQuestion);
  };

  const setDailyActivity = async (newActivity) => {
    await setDoc(doc(db, 'app_settings', 'daily_activity'), { activity: newActivity });
  };

  // Watch for handle change, fetch profile if logged in
  useEffect(() => {
    if (activeHandle) {
      Cookies.set('cf_active_handle', activeHandle, { expires: 7 }); // Cookie expires in 7 days
      fetchUserProfile(activeHandle);
    } else {
      Cookies.remove('cf_active_handle');
      setUserProfile(null);
    }
  }, [activeHandle]);

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
          tags: s.problem.tags, // Added for radar chart
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
      
      // Fetch social feed for these tracked users
      const feed = await codeforcesAPI.getUsersActivity(trackedHandles, 5); // 5 submissions per tracked friend
      // Clean up and format feed
      const formattedFeed = feed.slice(0, 15).map(s => ({
        handle: s.handle,
        problem: s.problem.name,
        rating: s.problem.rating || 'Unrated',
        verdict: s.verdict,
        timeSeconds: s.creationTimeSeconds,
        contestId: s.problem.contestId
      }));
      setSocialFeed(formattedFeed);
      
    } catch (e) {
      console.error("Failed to fetch leaderboard or social feed", e);
    }
  };

  const fetchContests = async () => {
    try {
      const contests = await codeforcesAPI.getUpcomingContests();
      setUpcomingContests(contests.slice(0, 3)); // Store next 3
    } catch (e) {
      console.error("Failed to fetch contests", e);
    }
  };

  // Re-fetch leaderboard periodically or when tracked users change
  useEffect(() => {
    fetchLeaderboard();
  }, [trackedHandles]);

  // Fetch contests once on mount if user is logged in
  useEffect(() => {
    if (activeHandle) fetchContests();
  }, [activeHandle]);

  const login = async (handle) => {
     try {
       // Just verify it exists
       await codeforcesAPI.getUserInfo(handle);
       setActiveHandle(handle);
       
       // Add to Firestore so everyone tracks them on the global leaderboard
       await setDoc(doc(db, 'users', handle.toLowerCase()), { 
          handle: handle,
          joinedAt: new Date().toISOString()
       }, { merge: true });

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
      trackedHandles, setTrackedHandles,
      upcomingContests, socialFeed
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
