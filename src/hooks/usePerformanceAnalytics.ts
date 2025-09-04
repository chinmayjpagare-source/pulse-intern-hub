import { useState, useEffect } from 'react';

export interface PerformanceMetrics {
  averageScore: number;
  totalSessions: number;
  improvementTrend: number;
  strengthAreas: string[];
  weaknessAreas: string[];
  sessionHistory: SessionData[];
}

export interface SessionData {
  id: string;
  type: 'HR' | 'Technical' | 'Behavioral';
  score: number;
  duration: number;
  completedAt: Date;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const usePerformanceAnalytics = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    averageScore: 0,
    totalSessions: 0,
    improvementTrend: 0,
    strengthAreas: [],
    weaknessAreas: [],
    sessionHistory: []
  });

  useEffect(() => {
    // Load analytics from localStorage
    const savedSessions = localStorage.getItem('interview_sessions');
    if (savedSessions) {
      const sessions: SessionData[] = JSON.parse(savedSessions);
      updateMetrics(sessions);
    }
  }, []);

  const addSession = (session: SessionData) => {
    const updatedSessions = [session, ...metrics.sessionHistory];
    
    // Save to localStorage
    localStorage.setItem('interview_sessions', JSON.stringify(updatedSessions));
    
    updateMetrics(updatedSessions);
  };

  const updateMetrics = (sessions: SessionData[]) => {
    if (sessions.length === 0) {
      setMetrics(prev => ({ ...prev, sessionHistory: [] }));
      return;
    }

    const averageScore = sessions.reduce((sum, session) => sum + session.score, 0) / sessions.length;
    
    // Calculate improvement trend (last 3 sessions vs previous 3)
    let improvementTrend = 0;
    if (sessions.length >= 6) {
      const recent = sessions.slice(0, 3).reduce((sum, s) => sum + s.score, 0) / 3;
      const previous = sessions.slice(3, 6).reduce((sum, s) => sum + s.score, 0) / 3;
      improvementTrend = recent - previous;
    }

    // Aggregate strengths and weaknesses
    const strengthMap = new Map<string, number>();
    const weaknessMap = new Map<string, number>();

    sessions.forEach(session => {
      session.strengths.forEach(strength => {
        strengthMap.set(strength, (strengthMap.get(strength) || 0) + 1);
      });
      session.improvements.forEach(weakness => {
        weaknessMap.set(weakness, (weaknessMap.get(weakness) || 0) + 1);
      });
    });

    const strengthAreas = Array.from(strengthMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([strength]) => strength);

    const weaknessAreas = Array.from(weaknessMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([weakness]) => weakness);

    setMetrics({
      averageScore: Math.round(averageScore),
      totalSessions: sessions.length,
      improvementTrend: Math.round(improvementTrend),
      strengthAreas,
      weaknessAreas,
      sessionHistory: sessions
    });
  };

  const getScoreByType = (type: 'HR' | 'Technical' | 'Behavioral') => {
    const typeSessions = metrics.sessionHistory.filter(s => s.type === type);
    if (typeSessions.length === 0) return 0;
    return Math.round(typeSessions.reduce((sum, s) => sum + s.score, 0) / typeSessions.length);
  };

  const getRecentPerformance = (days: number = 7) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    return metrics.sessionHistory.filter(session => 
      new Date(session.completedAt) > cutoff
    );
  };

  return {
    metrics,
    addSession,
    getScoreByType,
    getRecentPerformance
  };
};