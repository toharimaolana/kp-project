import { useState, useEffect, useRef } from 'react';

export function useReadingTimer(moduleSlug, durationMinutes = 15, onFinish) {
  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const timerRef = useRef(null);

  // Initialize session from localStorage
  useEffect(() => {
    const savedSession = localStorage.getItem('reading_session');
    if (savedSession) {
      try {
        const parsed = JSON.parse(savedSession);
        // Only resume if it matches the current module
        if (parsed.moduleSlug === moduleSlug) {
          const now = Date.now();
          if (parsed.endTime > now) {
            setSession(parsed);
            setTimeLeft(Math.floor((parsed.endTime - now) / 1000));
          } else {
            // Time is already up
            finishSession(parsed, 'time_up');
          }
        }
      } catch (e) {
        console.error("Failed to parse reading session", e);
      }
    }
  }, [moduleSlug]);

  // Handle countdown
  useEffect(() => {
    if (session && timeLeft !== null && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            finishSession(session, 'time_up');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [session, timeLeft]);

  const startSession = (studentName, studentClass) => {
    const endTime = Date.now() + durationMinutes * 60 * 1000;
    const newSession = {
      name: studentName,
      class: studentClass,
      moduleSlug,
      endTime
    };
    
    localStorage.setItem('reading_session', JSON.stringify(newSession));
    setSession(newSession);
    setTimeLeft(durationMinutes * 60);
  };

  const finishSession = (activeSession = session, status = 'completed') => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Clear localStorage
    localStorage.removeItem('reading_session');
    setSession(null);
    setTimeLeft(null);
    
    // Call the callback
    if (onFinish && activeSession) {
      onFinish(activeSession, status);
    }
  };

  const formatTime = (seconds) => {
    if (seconds === null) return "00:00";
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return {
    session,
    timeLeft,
    formattedTime: formatTime(timeLeft),
    startSession,
    finishSession: () => finishSession(session, 'completed')
  };
}
