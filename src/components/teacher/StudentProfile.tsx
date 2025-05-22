import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

interface StudentProfileProps {
  onLogout: () => void;
}

interface Student {
  id: string;
  name: string;
  email: string;
  gradeLevel: string;
  avatar: string;
  contactInfo: {
    parent: string;
    phone: string;
    email: string;
  };
}

interface Grade {
  id: string;
  subject: string;
  topic: string;
  score: number;
  date: string;
  max: number;
}

interface AttendanceRecord {
  month: string;
  present: number;
  absent: number;
  late: number;
}

interface Note {
  id: string;
  date: string;
  content: string;
  author: string;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ onLogout }) => {
  const { studentId } = useParams<{ studentId: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [grades, setGrades] = useState<Grade[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'overview' | 'grades' | 'attendance' | 'notes'>('overview');

  // Mock data loading
  useEffect(() => {
    // In a real application, these would be API calls
    setStudent({
      id: studentId || 's1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      gradeLevel: '10th Grade',
      avatar: '👨‍🎓',
      contactInfo: {
        parent: 'Maria Smith',
        phone: '(555) 123-4567',
        email: 'maria.smith@example.com',
      },
    });

    setGrades([
      { id: 'g1', subject: 'Mathematics', topic: 'Algebra', score: 65, max: 100, date: '2023-05-10' },
      { id: 'g2', subject: 'Mathematics', topic: 'Geometry', score: 72, max: 100, date: '2023-05-15' },
      { id: 'g3', subject: 'Science', topic: 'Biology', score: 81, max: 100, date: '2023-05-12' },
      { id: 'g4', subject: 'Science', topic: 'Chemistry', score: 58, max: 100, date: '2023-05-20' },
      { id: 'g5', subject: 'English', topic: 'Grammar', score: 75, max: 100, date: '2023-05-18' },
    ]);

    setAttendance([
      { month: 'January', present: 18, absent: 2, late: 1 },
      { month: 'February', present: 16, absent: 3, late: 2 },
      { month: 'March', present: 20, absent: 1, late: 0 },
      { month: 'April', present: 19, absent: 0, late: 2 },
      { month: 'May', present: 15, absent: 2, late: 3 },
    ]);

    setNotes([
      { id: 'n1', date: '2023-05-05', content: 'John is struggling with algebra concepts. Recommend additional tutoring.', author: 'Ms. Johnson' },
      { id: 'n2', date: '2023-05-12', content: 'Had a conversation with John about his study habits. He agreed to spend more time on homework.', author: 'Mr. Davis' },
      { id: 'n3', date: '2023-05-18', content: 'John showed improvement in today\'s quiz. Continue to monitor progress.', author: 'Ms. Johnson' },
    ]);
  }, [studentId]);

  // Calculate overall average
  const overallAverage = grades.length > 0
    ? grades.reduce((sum, grade) => sum + (grade.score / grade.max * 100), 0) / grades.length
    : 0;

  // Handle adding a new note
  const handleAddNote = () => {
    if (newNote.trim()) {
      const newNoteItem: Note = {
        id: `n${notes.length + 1}`,
        date: new Date().toISOString().split('T')[0],
        content: newNote,
        author: 'You',
      };
      setNotes([newNoteItem, ...notes]);
      setNewNote('');
    }
  };

  if (!student) {
    return <div className="loading">Loading student data...</div>;
  }

  return (
    <div className="student-profile">
      <header className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <h1>PathFinder Teacher</h1>
            <div className="user-menu">
              <Link to="/teacher/dashboard" className="btn btn-secondary" style={{ marginRight: '1rem' }}>Dashboard</Link>
              <button className="btn btn-secondary" onClick={onLogout}>Logout</button>
            </div>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="profile-header">
          <div className="profile-avatar">
            <span className="avatar-icon">{student.avatar}</span>
          </div>
          <div className="profile-info">
            <h2>{student.name}</h2>
            <p>{student.gradeLevel} • {student.email}</p>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary">
              <span>📧</span> Contact Parent
            </button>
            <button className="btn btn-outline">
              <span>📝</span> Create Study Plan
            </button>
          </div>
        </div>

        <div className="profile-tabs">
          <div 
            className={`tab ${activeTab === 'overview' ? 'active' : ''}`} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </div>
          <div 
            className={`tab ${activeTab === 'grades' ? 'active' : ''}`} 
            onClick={() => setActiveTab('grades')}
          >
            Grades
          </div>
          <div 
            className={`tab ${activeTab === 'attendance' ? 'active' : ''}`} 
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </div>
          <div 
            className={`tab ${activeTab === 'notes' ? 'active' : ''}`} 
            onClick={() => setActiveTab('notes')}
          >
            Notes & Comments
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="profile-content">
            <div className="overview-grid">
              <div className="card">
                <h3>Academic Performance</h3>
                <div className="stat-value">{overallAverage.toFixed(1)}%</div>
                <div className="progress-bar">
                  <div 
                    className="progress" 
                    style={{ 
                      width: `${overallAverage}%`,
                      backgroundColor: overallAverage < 70 ? '#f44336' : overallAverage < 80 ? '#ff9800' : '#4caf50'
                    }}
                  ></div>
                </div>
                <div className="performance-label">
                  {overallAverage < 70 ? 'Needs Improvement' : overallAverage < 80 ? 'Satisfactory' : 'Good'}
                </div>
              </div>

              <div className="card">
                <h3>Contact Information</h3>
                <div className="contact-info">
                  <div className="info-item">
                    <div className="info-label">Parent/Guardian:</div>
                    <div className="info-value">{student.contactInfo.parent}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Phone:</div>
                    <div className="info-value">{student.contactInfo.phone}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-label">Email:</div>
                    <div className="info-value">{student.contactInfo.email}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <h3>Recent Grades</h3>
              <table className="grades-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Topic</th>
                    <th>Score</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {grades.slice(0, 3).map(grade => (
                    <tr key={grade.id}>
                      <td>{grade.subject}</td>
                      <td>{grade.topic}</td>
                      <td>
                        <span 
                          className={
                            grade.score / grade.max < 0.7 ? 'text-danger' : 
                            grade.score / grade.max < 0.8 ? 'text-warning' : 
                            'text-success'
                          }
                        >
                          {grade.score}/{grade.max} ({(grade.score / grade.max * 100).toFixed(1)}%)
                        </span>
                      </td>
                      <td>{grade.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="view-all">
                <button className="btn btn-link" onClick={() => setActiveTab('grades')}>View All Grades</button>
              </div>
            </div>

            <div className="card">
              <h3>Recent Notes</h3>
              <div className="notes-list">
                {notes.slice(0, 2).map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <span className="note-author">{note.author}</span>
                      <span className="note-date">{note.date}</span>
                    </div>
                    <div className="note-content">{note.content}</div>
                  </div>
                ))}
              </div>
              <div className="view-all">
                <button className="btn btn-link" onClick={() => setActiveTab('notes')}>View All Notes</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'grades' && (
          <div className="profile-content">
            <div className="card">
              <h3>All Grades</h3>
              <table className="grades-table">
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
                      <td>
                        <span 
                          className={
                            grade.score / grade.max < 0.7 ? 'text-danger' : 
                            grade.score / grade.max < 0.8 ? 'text-warning' : 
                            'text-success'
                          }
                        >
                          {grade.score}/{grade.max} ({(grade.score / grade.max * 100).toFixed(1)}%)
                        </span>
                      </td>
                      <td>{grade.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="profile-content">
            <div className="card">
              <h3>Attendance Records</h3>
              <table className="attendance-table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Present</th>
                    <th>Absent</th>
                    <th>Late</th>
                    <th>Attendance Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {attendance.map((record, index) => {
                    const total = record.present + record.absent + record.late;
                    const rate = total > 0 ? ((record.present + record.late * 0.5) / total * 100).toFixed(1) : '0.0';
                    
                    return (
                      <tr key={index}>
                        <td>{record.month}</td>
                        <td>{record.present}</td>
                        <td>{record.absent}</td>
                        <td>{record.late}</td>
                        <td>
                          <span className={
                            parseFloat(rate) < 80 ? 'text-danger' : 
                            parseFloat(rate) < 90 ? 'text-warning' : 
                            'text-success'
                          }>
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="profile-content">
            <div className="card">
              <h3>Add a Note</h3>
              <div className="note-form">
                <textarea 
                  className="form-control"
                  rows={4}
                  placeholder="Enter a note about this student..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                ></textarea>
                <button 
                  className="btn btn-primary"
                  onClick={handleAddNote}
                  disabled={!newNote.trim()}
                >
                  Add Note
                </button>
              </div>
            </div>
            
            <div className="card">
              <h3>Notes History</h3>
              <div className="notes-list">
                {notes.map(note => (
                  <div key={note.id} className="note-item">
                    <div className="note-header">
                      <span className="note-author">{note.author}</span>
                      <span className="note-date">{note.date}</span>
                    </div>
                    <div className="note-content">{note.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentProfile; 