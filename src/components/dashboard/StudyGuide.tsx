import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Mock data interfaces
interface StudyTopic {
  id: number;
  subject: string;
  topic: string;
  summary: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface PracticeQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface Resource {
  id: number;
  title: string;
  type: 'video' | 'article' | 'quiz';
  url: string;
  duration: string;
}

interface StudySchedule {
  day: string;
  activities: {
    time: string;
    activity: string;
    completed: boolean;
  }[];
}

const StudyGuide: React.FC = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const [activeTab, setActiveTab] = useState<string>('summary');
  const [topic, setTopic] = useState<StudyTopic | null>(null);
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [schedule, setSchedule] = useState<StudySchedule[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Mock fetching data based on topicId
  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    
    setTimeout(() => {
      // Get topic data based on ID
      if (topicId === "geometry") {
        setTopic({
          id: 1,
          subject: 'Mathematics',
          topic: 'Geometry',
          summary: `Geometry is the branch of mathematics that studies the sizes, shapes, positions, and dimensions of things. Core concepts include:
          
1. **Points, Lines, and Angles**: Learn about basic geometric elements and how they relate to each other.
2. **Polygons**: Understand triangles, quadrilaterals, and other multi-sided shapes.
3. **Circles**: Study the properties of circles, including arcs, chords, and tangent lines.
4. **Area and Volume**: Calculate the size of 2D shapes and 3D objects.
5. **Coordinate Geometry**: Plot points and shapes on a coordinate plane.`,
          difficulty: 'intermediate'
        });
        
        setQuestions([
          {
            id: 1,
            question: 'What is the sum of interior angles in a triangle?',
            options: ['90 degrees', '180 degrees', '270 degrees', '360 degrees'],
            correctAnswer: 1
          },
          {
            id: 2,
            question: 'Which of the following is NOT a type of triangle classification?',
            options: ['Scalene', 'Isosceles', 'Equilateral', 'Rectangular'],
            correctAnswer: 3
          },
          {
            id: 3,
            question: 'What is the formula for the area of a circle?',
            options: ['πr', '2πr', 'πr²', '2πr²'],
            correctAnswer: 2
          }
        ]);
        
        setResources([
          {
            id: 1,
            title: 'Introduction to Geometry',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=302eJ3TzJQU',
            duration: '10:24'
          },
          {
            id: 2,
            title: 'Triangles and Their Properties',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=UD_WX70JMdI',
            duration: '12:52'
          },
          {
            id: 3,
            title: 'Interactive Geometry Practice',
            type: 'quiz',
            url: 'https://www.khanacademy.org/math/geometry/hs-geo-foundations',
            duration: '30:00'
          }
        ]);
        
        setSchedule([
          {
            day: 'Monday',
            activities: [
              { time: '4:00 PM - 4:30 PM', activity: 'Watch "Introduction to Geometry" video', completed: false },
              { time: '4:30 PM - 5:00 PM', activity: 'Review basic concepts and take notes', completed: false }
            ]
          },
          {
            day: 'Wednesday',
            activities: [
              { time: '4:00 PM - 4:30 PM', activity: 'Watch "Triangles and Their Properties" video', completed: false },
              { time: '4:30 PM - 5:00 PM', activity: 'Practice triangle problems', completed: false }
            ]
          },
          {
            day: 'Friday',
            activities: [
              { time: '4:00 PM - 4:45 PM', activity: 'Complete Interactive Geometry Practice quiz', completed: false },
              { time: '4:45 PM - 5:00 PM', activity: 'Review incorrect answers', completed: false }
            ]
          }
        ]);
      } else if (topicId === "chemistry") {
        setTopic({
          id: 2,
          subject: 'Science',
          topic: 'Chemistry',
          summary: `Chemistry is the study of matter, its properties, composition, structure, and the changes it undergoes during reactions. Key concepts include:
          
1. **Atomic Structure**: Understand the building blocks of matter including protons, neutrons, and electrons.
2. **Periodic Table**: Learn about element organization, properties, and trends.
3. **Chemical Bonding**: Study how atoms combine to form compounds through ionic, covalent, and metallic bonds.
4. **Chemical Reactions**: Explore different types of reactions and how to balance chemical equations.
5. **States of Matter**: Examine solids, liquids, gases, and phase changes.`,
          difficulty: 'intermediate'
        });
        
        setQuestions([
          {
            id: 1,
            question: 'Which subatomic particle has a negative charge?',
            options: ['Proton', 'Neutron', 'Electron', 'Nucleus'],
            correctAnswer: 2
          },
          {
            id: 2,
            question: 'What is the chemical formula for water?',
            options: ['H2O', 'CO2', 'O2', 'NaCl'],
            correctAnswer: 0
          },
          {
            id: 3,
            question: 'Which of these is NOT a state of matter?',
            options: ['Solid', 'Liquid', 'Gas', 'Element'],
            correctAnswer: 3
          }
        ]);
        
        setResources([
          {
            id: 1,
            title: 'Introduction to Chemistry',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=2nlfH66TvsM',
            duration: '11:36'
          },
          {
            id: 2,
            title: 'Understanding the Periodic Table',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=0RRVV4Diomg',
            duration: '9:24'
          },
          {
            id: 3,
            title: 'Chemistry Practice Quiz',
            type: 'quiz',
            url: 'https://www.khanacademy.org/science/chemistry',
            duration: '25:00'
          }
        ]);
        
        setSchedule([
          {
            day: 'Tuesday',
            activities: [
              { time: '5:00 PM - 5:30 PM', activity: 'Watch "Introduction to Chemistry" video', completed: false },
              { time: '5:30 PM - 6:00 PM', activity: 'Create flashcards for key terms', completed: false }
            ]
          },
          {
            day: 'Thursday',
            activities: [
              { time: '5:00 PM - 5:30 PM', activity: 'Watch "Understanding the Periodic Table" video', completed: false },
              { time: '5:30 PM - 6:00 PM', activity: 'Practice drawing atomic structures', completed: false }
            ]
          },
          {
            day: 'Saturday',
            activities: [
              { time: '10:00 AM - 10:45 AM', activity: 'Complete Chemistry Practice Quiz', completed: false },
              { time: '10:45 AM - 11:00 AM', activity: 'Review incorrect answers', completed: false }
            ]
          }
        ]);
      }
      
      setLoading(false);
    }, 1000);
  }, [topicId]);

  // Toggle activity completion status
  const toggleActivityCompletion = (dayIndex: number, activityIndex: number) => {
    const updatedSchedule = [...schedule];
    const activity = updatedSchedule[dayIndex].activities[activityIndex];
    activity.completed = !activity.completed;
    setSchedule(updatedSchedule);
    
    // Calculate progress
    calculateProgress();
  };

  // Calculate total progress
  const calculateProgress = () => {
    const totalActivities = schedule.reduce((sum, day) => sum + day.activities.length, 0);
    const completedActivities = schedule.reduce((sum, day) => 
      sum + day.activities.filter(a => a.completed).length, 0);
      
    const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
    setProgress(progressPercentage);
  };

  // Handle answering questions
  const handleAnswerSelect = (questionId: number, optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  // Submit practice quiz
  const handleQuizSubmit = () => {
    setShowResults(true);
  };

  // Reset quiz
  const handleQuizReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  // Calculate quiz score
  const calculateScore = () => {
    const totalQuestions = questions.length;
    const correctAnswers = questions.filter(q => 
      selectedAnswers[q.id] === q.correctAnswer
    ).length;
    
    return {
      score: correctAnswers,
      total: totalQuestions,
      percentage: Math.round((correctAnswers / totalQuestions) * 100)
    };
  };

  if (loading) {
    return (
      <div className="study-guide-container card">
        <div className="loading-spinner">
          <p>Loading your personalized study guide...</p>
        </div>
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="study-guide-container card">
        <h2>Study Guide Not Found</h2>
        <p>We couldn't find a study guide for this topic. Please return to your dashboard.</p>
        <Link to="/dashboard" className="btn btn-primary">Back to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="study-guide-container">
      <div className="study-guide-header card">
        <div className="study-guide-title">
          <h2>{topic.subject}: {topic.topic} Study Guide</h2>
          <span className={`difficulty-badge ${topic.difficulty}`}>{topic.difficulty}</span>
        </div>
        <div className="progress-container">
          <div className="progress-info">
            <span>Study Progress:</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <div className="study-guide-nav">
          <button 
            className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('summary')}
          >
            Summary
          </button>
          <button 
            className={`tab-btn ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
          >
            Practice Questions
          </button>
          <button 
            className={`tab-btn ${activeTab === 'resources' ? 'active' : ''}`}
            onClick={() => setActiveTab('resources')}
          >
            Learning Resources
          </button>
          <button 
            className={`tab-btn ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Study Schedule
          </button>
        </div>
      </div>

      <div className="study-guide-content card">
        {activeTab === 'summary' && (
          <div className="summary-content">
            <h3>Topic Summary</h3>
            <div className="topic-summary">
              {topic.summary.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="practice-content">
            <h3>Practice Questions</h3>
            <div className="quiz-instructions">
              <p>Answer the following questions to test your understanding of {topic.topic}</p>
            </div>
            <div className="practice-questions">
              {questions.map((q, index) => (
                <div key={q.id} className="question-card">
                  <div className="question-number">Question {index + 1}</div>
                  <div className="question-text">{q.question}</div>
                  <div className="options-list">
                    {q.options.map((option, optIndex) => (
                      <div key={optIndex} className="option-item">
                        <label className={`option-label ${
                          showResults ? 
                            (optIndex === q.correctAnswer ? 'correct' : 
                             selectedAnswers[q.id] === optIndex ? 'incorrect' : '') 
                            : ''
                        }`}>
                          <input 
                            type="radio" 
                            name={`question-${q.id}`}
                            checked={selectedAnswers[q.id] === optIndex}
                            onChange={() => handleAnswerSelect(q.id, optIndex)}
                            disabled={showResults}
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  {showResults && (
                    <div className="answer-feedback">
                      {selectedAnswers[q.id] === q.correctAnswer ? 
                        <span className="correct-answer">Correct!</span> : 
                        <span className="incorrect-answer">
                          Incorrect. The correct answer is: {q.options[q.correctAnswer]}
                        </span>
                      }
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="quiz-actions">
              {!showResults ? (
                <button 
                  className="btn btn-primary"
                  onClick={handleQuizSubmit}
                  disabled={Object.keys(selectedAnswers).length !== questions.length}
                >
                  Submit Answers
                </button>
              ) : (
                <div className="quiz-results">
                  <div className="score-display">
                    <h4>Your Score: {calculateScore().score}/{calculateScore().total} ({calculateScore().percentage}%)</h4>
                    {calculateScore().percentage >= 70 ? 
                      <p className="success-message">Great job! You've demonstrated good understanding of this topic.</p> :
                      <p className="improvement-message">Keep studying! Review the topics you missed and try again.</p>
                    }
                  </div>
                  <button className="btn btn-secondary" onClick={handleQuizReset}>
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-content">
            <h3>Learning Resources</h3>
            <p className="resources-intro">
              These resources have been selected to help you understand {topic.topic} better.
            </p>
            <div className="resources-list">
              {resources.map(resource => (
                <div key={resource.id} className="resource-card">
                  <div className="resource-type-icon">
                    {resource.type === 'video' && <span className="video-icon">📹</span>}
                    {resource.type === 'article' && <span className="article-icon">📄</span>}
                    {resource.type === 'quiz' && <span className="quiz-icon">✓</span>}
                  </div>
                  <div className="resource-details">
                    <h4 className="resource-title">{resource.title}</h4>
                    <div className="resource-meta">
                      <span className="resource-type">{resource.type}</span>
                      <span className="resource-duration">{resource.duration}</span>
                    </div>
                  </div>
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary resource-btn"
                  >
                    Access
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="schedule-content">
            <h3>Recommended Study Schedule</h3>
            <p className="schedule-intro">
              Follow this personalized schedule to improve your understanding of {topic.topic}.
            </p>
            <div className="schedule-list">
              {schedule.map((day, dayIndex) => (
                <div key={dayIndex} className="schedule-day">
                  <h4 className="day-title">{day.day}</h4>
                  <div className="day-activities">
                    {day.activities.map((activity, activityIndex) => (
                      <div key={activityIndex} className="activity-item">
                        <label className="activity-label">
                          <input 
                            type="checkbox" 
                            checked={activity.completed}
                            onChange={() => toggleActivityCompletion(dayIndex, activityIndex)}
                          />
                          <div className="activity-details">
                            <span className="activity-time">{activity.time}</span>
                            <span className="activity-name">{activity.activity}</span>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="study-guide-actions card">
        <Link to="/dashboard" className="btn btn-secondary">
          Back to Dashboard
        </Link>
        {progress === 100 && (
          <div className="completion-message">
            <span>🎉 Congratulations on completing this study guide!</span>
            <button className="btn btn-primary">
              Try Advanced Level
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyGuide; 