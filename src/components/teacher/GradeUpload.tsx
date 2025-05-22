import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface GradeUploadProps {
  onLogout: () => void;
}

interface ClassOption {
  id: string;
  name: string;
  subject: string;
}

interface Student {
  id: string;
  name: string;
  currentGrade: number;
  newGrade?: number;
}

const GradeUpload: React.FC<GradeUploadProps> = ({ onLogout }) => {
  // Mock data
  const [classes, setClasses] = useState<ClassOption[]>([
    { id: 'c1', name: 'Period 1', subject: 'Algebra' },
    { id: 'c2', name: 'Period 2', subject: 'Geometry' },
    { id: 'c3', name: 'Period 3', subject: 'Biology' },
    { id: 'c4', name: 'Period 4', subject: 'Chemistry' },
  ]);

  const [selectedClass, setSelectedClass] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [assessmentName, setAssessmentName] = useState<string>('');
  const [assessmentDate, setAssessmentDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showManualEntry, setShowManualEntry] = useState<boolean>(false);

  // Mock student data for when a class is selected
  const mockStudentData: { [key: string]: Student[] } = {
    c1: [
      { id: 's1', name: 'John Smith', currentGrade: 78 },
      { id: 's2', name: 'Emily Johnson', currentGrade: 85 },
      { id: 's3', name: 'Michael Brown', currentGrade: 92 },
      { id: 's4', name: 'Sarah Davis', currentGrade: 65 },
      { id: 's5', name: 'James Wilson', currentGrade: 75 },
    ],
    c2: [
      { id: 's6', name: 'Robert Taylor', currentGrade: 80 },
      { id: 's7', name: 'Jennifer Martinez', currentGrade: 88 },
      { id: 's8', name: 'William Thompson', currentGrade: 73 },
      { id: 's9', name: 'Linda Anderson', currentGrade: 95 },
      { id: 's10', name: 'David Garcia', currentGrade: 67 },
    ],
    c3: [
      { id: 's11', name: 'Richard Rodriguez', currentGrade: 82 },
      { id: 's12', name: 'Patricia Lewis', currentGrade: 79 },
      { id: 's13', name: 'Charles Lee', currentGrade: 90 },
      { id: 's14', name: 'Barbara Walker', currentGrade: 72 },
      { id: 's15', name: 'Joseph Hall', currentGrade: 85 },
    ],
    c4: [
      { id: 's16', name: 'Thomas Allen', currentGrade: 77 },
      { id: 's17', name: 'Nancy Young', currentGrade: 81 },
      { id: 's18', name: 'Daniel King', currentGrade: 68 },
      { id: 's19', name: 'Lisa Wright', currentGrade: 93 },
      { id: 's20', name: 'Mark Scott', currentGrade: 76 },
    ],
  };

  // Handle class selection
  const handleClassChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    
    if (classId) {
      setStudents(mockStudentData[classId].map(student => ({
        ...student,
        newGrade: student.currentGrade // Initialize with current grade
      })));
    } else {
      setStudents([]);
    }
  };

  // Handle grade change for a student
  const handleGradeChange = (studentId: string, value: string) => {
    const grade = parseInt(value);
    if (!isNaN(grade) && grade >= 0 && grade <= 100) {
      setStudents(students.map(student => 
        student.id === studentId 
          ? { ...student, newGrade: grade } 
          : student
      ));
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // In a real application, you would process the file here
      // For now, we'll just simulate an upload
      setIsUploading(true);
      
      setTimeout(() => {
        setIsUploading(false);
        setSuccessMessage('Grades imported successfully! You can review and adjust them below.');
        
        // Simulate parsing the file and getting student grades
        if (selectedClass) {
          const parsedStudents = mockStudentData[selectedClass].map(student => ({
            ...student,
            newGrade: Math.floor(Math.random() * 31) + 70 // Random grade between 70-100
          }));
          setStudents(parsedStudents);
          setShowManualEntry(true);
        }
      }, 1500);
    }
  };

  // Submit grades
  const handleSubmitGrades = () => {
    setIsUploading(true);
    
    // In a real app, you would send the data to an API
    setTimeout(() => {
      setIsUploading(false);
      setSuccessMessage(`Grades for "${assessmentName}" successfully submitted!`);
      
      // Reset form
      setTimeout(() => {
        setSuccessMessage('');
        setStudents([]);
        setAssessmentName('');
        setAssessmentDate(new Date().toISOString().split('T')[0]);
        setSelectedClass('');
        setShowManualEntry(false);
      }, 3000);
    }, 1500);
  };

  return (
    <div className="teacher-grade-upload">
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
        <div className="dashboard-welcome">
          <h2>Upload and Manage Grades</h2>
          <p>Add new assessment results or update existing grades</p>
        </div>

        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
          </div>
        )}

        <div className="card">
          <h3>Assessment Details</h3>
          <div className="assessment-form">
            <div className="form-group">
              <label htmlFor="className">Class</label>
              <select 
                id="className"
                value={selectedClass}
                onChange={handleClassChange}
                className="form-control"
              >
                <option value="">Select a class</option>
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="assessmentName">Assessment Name</label>
              <input
                type="text"
                id="assessmentName"
                value={assessmentName}
                onChange={(e) => setAssessmentName(e.target.value)}
                placeholder="e.g., Midterm Exam, Quiz 3, Chapter 5 Test"
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="assessmentDate">Assessment Date</label>
              <input
                type="date"
                id="assessmentDate"
                value={assessmentDate}
                onChange={(e) => setAssessmentDate(e.target.value)}
                className="form-control"
              />
            </div>
          </div>
        </div>

        {selectedClass && (
          <div className="card">
            <h3>Add Grades</h3>
            
            <div className="upload-options">
              <div className="upload-option">
                <h4>Import from File</h4>
                <p>Upload an Excel or CSV file with student grades</p>
                <div className="file-upload">
                  <label className="btn btn-outline">
                    Select File
                    <input 
                      type="file" 
                      accept=".csv,.xlsx,.xls" 
                      style={{ display: 'none' }}
                      onChange={handleFileUpload}
                    />
                  </label>
                  <span className="file-info">Supported formats: .xlsx, .xls, .csv</span>
                </div>
              </div>
              
              <div className="upload-option">
                <h4>Manual Entry</h4>
                <p>Enter grades manually for each student</p>
                <button 
                  className="btn btn-outline"
                  onClick={() => setShowManualEntry(!showManualEntry)}
                >
                  {showManualEntry ? 'Hide Entry Form' : 'Enter Grades Manually'}
                </button>
              </div>
            </div>
            
            {showManualEntry && students.length > 0 && (
              <div className="manual-grade-entry">
                <h4>Enter Grades for {classes.find(c => c.id === selectedClass)?.name} - {classes.find(c => c.id === selectedClass)?.subject}</h4>
                
                <table className="grades-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Current Average</th>
                      <th>New Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id}>
                        <td>{student.name}</td>
                        <td>{student.currentGrade}%</td>
                        <td>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={student.newGrade || ''}
                            onChange={(e) => handleGradeChange(student.id, e.target.value)}
                            className="grade-input"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <div className="form-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={handleSubmitGrades}
                    disabled={isUploading || !assessmentName}
                  >
                    {isUploading ? 'Submitting...' : 'Submit Grades'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default GradeUpload; 