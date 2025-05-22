import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();
  
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <Link to="/dashboard" className="logo">
              <h1>PathFinder</h1>
            </Link>
            <nav className="main-nav">
              <ul>
                <li className={location.pathname === '/dashboard' ? 'active' : ''}>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li className={location.pathname.includes('/study-guide') ? 'active' : ''}>
                  <Link to="/dashboard">Study Guides</Link>
                </li>
                <li className={location.pathname === '/progress' ? 'active' : ''}>
                  <Link to="/progress">Progress</Link>
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

export default DashboardLayout; 