import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// Mock data interfaces
interface Student {
  id: string;
  name: string;
  email: string;
  averageGrade: number;
  recentPerformance: 'improving' | 'stable' | 'declining';
}

interface Class {
  id: string;
  name: string;
  subject: string;
  students: number;
  averageGrade: number;
}

interface GradeDistribution {
  grade: string;
  count: number;
}

interface TeacherDashboardProps {
  onLogout: () => void;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ onLogout }) => {
  // Mock data
  const [classes, setClasses] = useState<Class[]>([
    { id: 'c1', name: 'Period 1', subject: 'Algebra', students: 25, averageGrade: 78 },
    { id: 'c2', name: 'Period 2', subject: 'Geometry', students: 28, averageGrade: 82 },
    { id: 'c3', name: 'Period 3', subject: 'Biology', students: 24, averageGrade: 75 },
    { id: 'c4', name: 'Period 4', subject: 'Chemistry', students: 22, averageGrade: 81 },
  ]);

  const [studentsAtRisk, setStudentsAtRisk] = useState<Student[]>([
    { id: 's1', name: 'John Smith', email: 'john.smith@example.com', averageGrade: 62, recentPerformance: 'declining' },
    { id: 's2', name: 'Emily Johnson', email: 'emily.j@example.com', averageGrade: 65, recentPerformance: 'stable' },
    { id: 's3', name: 'Michael Brown', email: 'michael.b@example.com', averageGrade: 68, recentPerformance: 'improving' },
  ]);

  const [gradeDistribution, setGradeDistribution] = useState<GradeDistribution[]>([
    { grade: 'A', count: 42 },
    { grade: 'B', count: 78 },
    { grade: 'C', count: 53 },
    { grade: 'D', count: 18 },
    { grade: 'F', count: 9 },
  ]);

  // Calculate total students and overall average
  const totalStudents = classes.reduce((sum, classItem) => sum + classItem.students, 0);
  const overallAverage = classes.reduce((sum, classItem) => sum + (classItem.averageGrade * classItem.students), 0) / totalStudents;

  return (
    <div className="teacher-dashboard">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>PathFinder Teacher</h1>
            <div className="user-menu">
              <Link to="/teacher/grades" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Upload Grades</Link>
              <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="dashboard-welcome">
          <h2>Teacher Dashboard</h2>
          <p>Monitor class performance and identify students who need additional support</p>
        </div>

        <div className="dashboard-stats">
          <div className="card">
            <h3>Overall Performance</h3>
            <div className="stat-value">{overallAverage.toFixed(1)}%</div>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${overallAverage}%` }}></div>
            </div>
          </div>

          <div className="card">
            <h3>Total Students</h3>
            <div className="stat-value">{totalStudents}</div>
          </div>

          <div className="card">
            <h3>Classes</h3>
            <div className="stat-value">{classes.length}</div>
          </div>
        </div>

        <h3>Your Classes</h3>
        <div className="classes-table">
          <table>
            <thead>
              <tr>
                <th>Class Name</th>
                <th>Subject</th>
                <th>Students</th>
                <th>Average Grade</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map(classItem => (
                <tr key={classItem.id}>
                  <td>{classItem.name}</td>
                  <td>{classItem.subject}</td>
                  <td>{classItem.students}</td>
                  <td>
                    {classItem.averageGrade}%
                    <div className="mini-progress">
                      <div className="mini-bar" style={{ width: `${classItem.averageGrade}%` }}></div>
                    </div>
                  </td>
                  <td>
                    <Link to={`/teacher/class/${classItem.id}`} className="btn btn-sm btn-primary">View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="dashboard-grid">
          <div className="card wide-card">
            <h3>Grade Distribution</h3>
            <div className="grade-distribution">
              {gradeDistribution.map((item, index) => (
                <div key={index} className="grade-bar">
                  <div className="grade-label">{item.grade}</div>
                  <div className="grade-count" style={{ height: `${(item.count / 200) * 100}%` }}>
                    <span className="count-label">{item.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card wide-card">
            <h3>Students At Risk</h3>
            <table className="risk-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Average</th>
                  <th>Trend</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {studentsAtRisk.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.averageGrade}%</td>
                    <td>
                      <span className={`trend trend-${student.recentPerformance}`}>
                        {student.recentPerformance === 'improving' ? '↑' : 
                         student.recentPerformance === 'declining' ? '↓' : '→'}
                      </span>
                    </td>
                    <td>
                      <Link to={`/teacher/student/${student.id}`} className="btn btn-sm btn-primary">View Profile</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card action-card">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <Link to="/teacher/grades" className="btn btn-primary">Upload New Grades</Link>
            <Link to="/teacher/reports" className="btn btn-primary">Generate Reports</Link>
            <Link to="/teacher/communication" className="btn btn-primary">Contact Parents</Link>
            <Link to="/teacher/resources" className="btn btn-primary">Create Learning Resources</Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashboard; 