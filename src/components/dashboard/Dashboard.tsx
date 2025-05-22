import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// For demonstration purposes, we'll create mock data
interface Grade {
  id: number;
  subject: string;
  topic: string;
  score: number;
  maxScore: number;
  date: string;
}

interface Progress {
  subject: string;
  completionRate: number;
}

interface WeakTopic {
  subject: string;
  topic: string;
  score: number;
  topicId: string; // Added to link to study guides
}

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  // Mock data for demonstration
  const [grades, setGrades] = useState<Grade[]>([
    { id: 1, subject: 'Mathematics', topic: 'Algebra', score: 85, maxScore: 100, date: '2023-05-10' },
    { id: 2, subject: 'Science', topic: 'Biology', score: 72, maxScore: 100, date: '2023-05-12' },
    { id: 3, subject: 'English', topic: 'Grammar', score: 90, maxScore: 100, date: '2023-05-15' },
    { id: 4, subject: 'Mathematics', topic: 'Geometry', score: 65, maxScore: 100, date: '2023-05-18' },
    { id: 5, subject: 'Science', topic: 'Chemistry', score: 60, maxScore: 100, date: '2023-05-20' },
  ]);

  const [progress, setProgress] = useState<Progress[]>([
    { subject: 'Mathematics', completionRate: 70 },
    { subject: 'Science', completionRate: 60 },
    { subject: 'English', completionRate: 85 },
  ]);

  const [weakTopics, setWeakTopics] = useState<WeakTopic[]>([
    { subject: 'Mathematics', topic: 'Geometry', score: 65, topicId: 'geometry' },
    { subject: 'Science', topic: 'Chemistry', score: 60, topicId: 'chemistry' },
  ]);

  // Calculate overall average
  const overallAverage = grades.reduce((sum, grade) => sum + (grade.score / grade.maxScore) * 100, 0) / grades.length;

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>PathFinder</h1>
            <div className="user-menu">
              <Link to="/progress" className="btn btn-secondary" style={{ marginRight: '1rem' }}>View Progress</Link>
              <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="dashboard-welcome">
          <h2>Welcome to your Learning Dashboard</h2>
          <p>Track your progress and get personalized learning resources</p>
        </div>

        <div className="dashboard-stats">
          <div className="card">
            <h3>Overall Performance</h3>
            <div className="stat-value">{overallAverage.toFixed(1)}%</div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${overallAverage}%` }}></div>
            </div>
          </div>
        </div>

        <h3>Your Recent Grades</h3>
        <div className="grades-table">
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Topic</th>
                <th>Score</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(grade => (
                <tr key={grade.id}>
                  <td>{grade.subject}</td>
                  <td>{grade.topic}</td>
                  <td>{grade.score}/{grade.maxScore} ({(grade.score / grade.maxScore * 100).toFixed(1)}%)</td>
                  <td>{grade.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Subjects Progress</h3>
        <div className="dashboard-grid">
          {progress.map((item, index) => (
            <div className="card" key={index}>
              <h4>{item.subject}</h4>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${item.completionRate}%` }}></div>
              </div>
              <div className="progress-value">{item.completionRate}%</div>
            </div>
          ))}
        </div>

        <h3>Areas Needing Improvement</h3>
        <div className="dashboard-grid">
          {weakTopics.map((topic, index) => (
            <div className="card" key={index}>
              <h4>{topic.subject}: {topic.topic}</h4>
              <p>Current Score: {topic.score}%</p>
              <Link to={`/study-guide/${topic.topicId}`} className="btn btn-primary">View Study Guide</Link>
            </div>
          ))}
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Your Study Journey</h3>
          <p>Follow these steps to improve your academic performance:</p>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div style={{ flex: '1 0 250px' }}>
              <h4>1. View Your Dashboard</h4>
              <p>See your current grades and identified weak areas.</p>
            </div>
            
            <div style={{ flex: '1 0 250px' }}>
              <h4>2. Access Study Guides</h4>
              <p>Use personalized study guides for weak topics.</p>
            </div>
            
            <div style={{ flex: '1 0 250px' }}>
              <h4>3. Complete Learning Activities</h4>
              <p>Watch videos, read summaries, and take practice quizzes.</p>
            </div>
            
            <div style={{ flex: '1 0 250px' }}>
              <h4>4. Track Your Progress</h4>
              <p>See your improvement and get recommendations for next steps.</p>
            </div>
          </div>
          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <Link to="/progress" className="btn btn-primary">Track Your Progress</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard; 