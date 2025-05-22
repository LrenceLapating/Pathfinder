import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface TeacherLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const TeacherLayout: React.FC<TeacherLayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();
  
  return (
    <div className="teacher-layout">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <Link to="/teacher/dashboard" className="logo">
              <h1>PathFinder Teacher</h1>
            </Link>
            <nav className="main-nav">
              <ul>
                <li className={location.pathname === '/teacher/dashboard' ? 'active' : ''}>
                  <Link to="/teacher/dashboard">Dashboard</Link>
                </li>
                <li className={location.pathname === '/teacher/grades' ? 'active' : ''}>
                  <Link to="/teacher/grades">Grades</Link>
                </li>
                <li className={location.pathname === '/teacher/reports' ? 'active' : ''}>
                  <Link to="/teacher/reports">Reports</Link>
                </li>
                <li className={location.pathname === '/teacher/resources' ? 'active' : ''}>
                  <Link to="/teacher/resources">Resources</Link>
                </li>
                <li className={location.pathname === '/teacher/communication' ? 'active' : ''}>
                  <Link to="/teacher/communication">Communication</Link>
                </li>
              </ul>
            </nav>
            <div className="user-menu">
              <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="dashboard-main">
        {children}
      </main>
      
      <footer className="dashboard-footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} PathFinder Learning Platform</p>
        </div>
      </footer>
    </div>
  );
};

export default TeacherLayout; 