import React, { useState, useEffect } from 'react';

interface ProgressData {
  subject: string;
  topic: string;
  initialScore: number;
  currentScore: number;
  improvementPercentage: number;
  lastUpdated: string;
  status: 'improved' | 'needs-work' | 'new';
}

interface StudyGuideCompletion {
  id: number;
  subject: string;
  topic: string;
  completionPercentage: number;
  activitiesCompleted: number;
  totalActivities: number;
  lastAccessed: string;
}

const ProgressTracking: React.FC = () => {
  // Mock data for demonstration
  const [progressData, setProgressData] = useState<ProgressData[]>([
    {
      subject: 'Mathematics',
      topic: 'Geometry',
      initialScore: 65,
      currentScore: 78,
      improvementPercentage: 20,
      lastUpdated: '2023-06-01',
      status: 'improved'
    },
    {
      subject: 'Science',
      topic: 'Chemistry',
      initialScore: 60,
      currentScore: 65,
      improvementPercentage: 8.3,
      lastUpdated: '2023-06-02',
      status: 'needs-work'
    },
    {
      subject: 'English',
      topic: 'Grammar',
      initialScore: 90,
      currentScore: 95,
      improvementPercentage: 5.6,
      lastUpdated: '2023-05-28',
      status: 'improved'
    },
    {
      subject: 'Mathematics',
      topic: 'Algebra',
      initialScore: 85,
      currentScore: 85,
      improvementPercentage: 0,
      lastUpdated: '2023-05-25',
      status: 'new'
    }
  ]);

  const [studyGuides, setStudyGuides] = useState<StudyGuideCompletion[]>([
    {
      id: 1,
      subject: 'Mathematics',
      topic: 'Geometry',
      completionPercentage: 75,
      activitiesCompleted: 6,
      totalActivities: 8,
      lastAccessed: '2023-06-02'
    },
    {
      id: 2,
      subject: 'Science',
      topic: 'Chemistry',
      completionPercentage: 50,
      activitiesCompleted: 3,
      totalActivities: 6,
      lastAccessed: '2023-06-03'
    },
    {
      id: 3,
      subject: 'English',
      topic: 'Grammar',
      completionPercentage: 100,
      activitiesCompleted: 6,
      totalActivities: 6,
      lastAccessed: '2023-05-30'
    },
    {
      id: 4,
      subject: 'Mathematics',
      topic: 'Algebra',
      completionPercentage: 0,
      activitiesCompleted: 0,
      totalActivities: 6,
      lastAccessed: 'Not started'
    }
  ]);

  // Calculate overall improvement
  const calculateOverallImprovement = (): number => {
    const improvementValues = progressData
      .filter(item => item.status !== 'new')
      .map(item => item.improvementPercentage);
    
    if (improvementValues.length === 0) return 0;
    
    return improvementValues.reduce((sum, value) => sum + value, 0) / improvementValues.length;
  };

  // Get recommendation based on progress data
  const getRecommendation = (): string => {
    const needsWorkTopics = progressData.filter(item => item.status === 'needs-work');
    const newTopics = progressData.filter(item => item.status === 'new');
    const improvedTopics = progressData.filter(item => item.status === 'improved');
    
    if (needsWorkTopics.length > 0) {
      return `Focus on improving your ${needsWorkTopics[0].subject}: ${needsWorkTopics[0].topic}. You're making progress but need more practice.`;
    } else if (newTopics.length > 0) {
      return `Start working on your ${newTopics[0].subject}: ${newTopics[0].topic} study guide to improve your understanding.`;
    } else if (improvedTopics.length > 0) {
      return `Great job improving your ${improvedTopics[0].subject}: ${improvedTopics[0].topic}! Consider trying a more advanced study guide.`;
    } else {
      return "Keep up with your current study guides to maintain your progress.";
    }
  };

  return (
    <div className="progress-tracking-container">
      <div className="progress-header card">
        <h2>Your Learning Progress</h2>
        <p>Track your improvement across different subjects and topics</p>
        
        <div className="overall-stats">
          <div className="stat-item">
            <div className="stat-label">Overall Improvement</div>
            <div className="stat-value">
              {calculateOverallImprovement().toFixed(1)}%
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Study Guides</div>
            <div className="stat-value">
              {studyGuides.length}
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Completed</div>
            <div className="stat-value">
              {studyGuides.filter(guide => guide.completionPercentage === 100).length}
            </div>
          </div>
        </div>
      </div>
      
      <div className="recommendation-card card">
        <h3>Personalized Recommendation</h3>
        <p>{getRecommendation()}</p>
      </div>
      
      <div className="progress-details card">
        <h3>Topic Progress</h3>
        <div className="progress-table">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Topic</th>
                <th>Initial Score</th>
                <th>Current Score</th>
                <th>Improvement</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {progressData.map((item, index) => (
                <tr key={index}>
                  <td>{item.subject}</td>
                  <td>{item.topic}</td>
                  <td>{item.initialScore}%</td>
                  <td>{item.currentScore}%</td>
                  <td className={`improvement ${item.status}`}>
                    {item.improvementPercentage > 0 ? `+${item.improvementPercentage.toFixed(1)}%` : 'New'}
                  </td>
                  <td>
                    <span className={`status-badge ${item.status}`}>
                      {item.status === 'improved' ? 'Improved' : item.status === 'needs-work' ? 'Needs Work' : 'New'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="study-guides-progress card">
        <h3>Study Guide Completion</h3>
        <div className="guides-grid">
          {studyGuides.map(guide => (
            <div key={guide.id} className="guide-progress-card">
              <div className="guide-title">
                <h4>{guide.subject}: {guide.topic}</h4>
                <span className="last-accessed">Last accessed: {guide.lastAccessed}</span>
              </div>
              <div className="completion-progress">
                <div className="progress-info">
                  <span>Progress: {guide.completionPercentage}%</span>
                  <span>{guide.activitiesCompleted}/{guide.totalActivities} activities</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ width: `${guide.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              <div className="guide-actions">
                {guide.completionPercentage === 100 ? (
                  <button className="btn btn-secondary">View Report</button>
                ) : guide.completionPercentage === 0 ? (
                  <button className="btn btn-primary">Start Guide</button>
                ) : (
                  <button className="btn btn-primary">Continue</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="next-steps card">
        <h3>Your Next Steps</h3>
        <ul className="steps-list">
          {progressData.some(item => item.status === 'needs-work') && (
            <li>
              <span className="step-icon">📝</span>
              <div className="step-content">
                <strong>Review weak topics</strong>
                <p>Spend extra time on topics where improvement is needed.</p>
              </div>
            </li>
          )}
          {studyGuides.some(guide => guide.completionPercentage > 0 && guide.completionPercentage < 100) && (
            <li>
              <span className="step-icon">🔄</span>
              <div className="step-content">
                <strong>Complete in-progress study guides</strong>
                <p>You have study guides that are partially completed.</p>
              </div>
            </li>
          )}
          {studyGuides.some(guide => guide.completionPercentage === 0) && (
            <li>
              <span className="step-icon">🚀</span>
              <div className="step-content">
                <strong>Start new study guides</strong>
                <p>Begin working on new topics to broaden your knowledge.</p>
              </div>
            </li>
          )}
          {progressData.some(item => item.status === 'improved' && item.improvementPercentage >= 20) && (
            <li>
              <span className="step-icon">⬆️</span>
              <div className="step-content">
                <strong>Try advanced material</strong>
                <p>You've shown significant improvement. Consider moving to more advanced study guides.</p>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default ProgressTracking; 