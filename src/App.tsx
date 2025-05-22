import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import StudyGuide from './components/dashboard/StudyGuide';
import ProgressTracking from './components/dashboard/ProgressTracking';
import DashboardLayout from './components/layout/DashboardLayout';
import LandingPage from './components/landing/LandingPage';
import TeacherDashboard from './components/teacher/TeacherDashboard';
import GradeUpload from './components/teacher/GradeUpload';
import StudentProfile from './components/teacher/StudentProfile';
import TeacherLayout from './components/layout/TeacherLayout';

const App: React.FC = () => {
  // Mock authentication state - in a real app, this would come from a context or state management
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [userRole, setUserRole] = React.useState<'student' | 'teacher'>('student');
  
  // Mock login function
  const handleLogin = (credentials: { email: string; password: string; role?: 'student' | 'teacher' }) => {
    // In a real app, this would call an API
    console.log('Login with:', credentials);
    setIsAuthenticated(true);
    setUserRole(credentials.role || 'student');
  };

  // Mock register function
  const handleRegister = (userData: { name: string; email: string; password: string; role?: 'student' | 'teacher' }) => {
    // In a real app, this would call an API
    console.log('Register with:', userData);
    setIsAuthenticated(true);
    setUserRole(userData.role || 'student');
  };

  // Mock logout function
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Render authenticated routes with the dashboard layout
  const renderWithDashboardLayout = (component: React.ReactNode) => {
    return isAuthenticated ? (
      <DashboardLayout onLogout={handleLogout}>
        {component}
      </DashboardLayout>
    ) : (
      <Navigate to="/login" />
    );
  };

  // Render authenticated routes with the teacher layout
  const renderWithTeacherLayout = (component: React.ReactNode) => {
    return isAuthenticated && userRole === 'teacher' ? (
      <TeacherLayout onLogout={handleLogout}>
        {component}
      </TeacherLayout>
    ) : (
      <Navigate to="/login" />
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          isAuthenticated ? 
            (userRole === 'teacher' ? <Navigate to="/teacher/dashboard" /> : <Navigate to="/dashboard" />) : 
            <Login onLogin={handleLogin} />
        } />
        <Route path="/register" element={
          isAuthenticated ? 
            (userRole === 'teacher' ? <Navigate to="/teacher/dashboard" /> : <Navigate to="/dashboard" />) : 
            <Register onRegister={handleRegister} />
        } />
        
        {/* Student Routes */}
        <Route path="/dashboard" element={renderWithDashboardLayout(<Dashboard onLogout={handleLogout} />)} />
        <Route path="/study-guide/:topicId" element={renderWithDashboardLayout(<StudyGuide />)} />
        <Route path="/progress" element={renderWithDashboardLayout(<ProgressTracking />)} />
        
        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={renderWithTeacherLayout(<TeacherDashboard onLogout={handleLogout} />)} />
        <Route path="/teacher/grades" element={renderWithTeacherLayout(<GradeUpload onLogout={handleLogout} />)} />
        <Route path="/teacher/student/:studentId" element={renderWithTeacherLayout(<StudentProfile onLogout={handleLogout} />)} />
        
        {/* Public Routes */}
        <Route path="/home" element={<LandingPage />} />
        <Route path="/" element={<Navigate to={isAuthenticated ? (userRole === 'teacher' ? "/teacher/dashboard" : "/dashboard") : "/home"} />} />
      </Routes>
    </Router>
  );
};

export default App; 