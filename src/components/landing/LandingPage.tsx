import React from 'react';
import { Link } from 'react-router-dom';
import dashboardScreenshot from '../../assets/images/sign in.png';

const LandingPage: React.FC = () => {
  return (
    <div className="landing-page">
      <header className="landing-header">
        <div className="container">
          <nav className="landing-nav">
            <div className="logo">
              <Link to="/">
                <h1>Pathfinder</h1>
              </Link>
            </div>
            <div className="nav-links">
              <ul>
                <li><Link to="/">About Pathfinder</Link></li>
                <li><Link to="/">Features</Link></li>
                <li><Link to="/">Pricing and Plans</Link></li>
                <li><Link to="/">Contact Us</Link></li>
              </ul>
            </div>
            <div className="nav-action">
              <Link to="/login" className="btn btn-primary">Get Started</Link>
            </div>
          </nav>
        </div>
      </header>

      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-image">
              <img src={dashboardScreenshot} alt="Dashboard Screenshot" />
            </div>
            <div className="hero-text">
              <h2 className="hero-title">
                Unlock <span className="highlight">Personalized</span> Learning with <span className="brand">Pathfinder</span>
              </h2>
              <p className="hero-description">
                Pathfinder's AI-powered platform offers intuitive dashboards, personalized study guides, and comprehensive progress tracking to enhance the learning experience for teachers and students. Start your journey today!
              </p>
              <div className="hero-actions">
                <Link to="/login" className="btn btn-primary btn-lg">Get Started</Link>
                <Link to="/" className="btn btn-outline btn-lg">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose <span className="highlight">Pathfinder</span>?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Data-Driven Insights</h3>
              <p>Automatically analyze student performance to identify learning gaps and opportunities for improvement.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Personalized Study Guides</h3>
              <p>Generate custom learning materials tailored to each student's needs and learning style.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Progress Tracking</h3>
              <p>Monitor improvement over time with comprehensive analytics and actionable recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👨‍🏫</div>
              <h3>Teacher Dashboard</h3>
              <p>Equip educators with tools to identify at-risk students and provide targeted interventions.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Users Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Pathfinder has transformed how I approach teaching. I can now easily identify which students need extra help and in which specific areas."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-name">Sarah Johnson</div>
                <div className="author-role">High School Math Teacher</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The personalized study guides have helped me improve my grades significantly. I love how the system adapts to my learning pace."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-name">Miguel Rodriguez</div>
                <div className="author-role">Student, Grade 10</div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"As a school administrator, I've seen a marked improvement in our overall academic performance since implementing Pathfinder."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-name">Dr. Emily Chen</div>
                <div className="author-role">School Principal</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to transform your learning experience?</h2>
            <p>Join thousands of teachers and students who are already benefiting from personalized education.</p>
            <Link to="/register" className="btn btn-primary btn-lg">Get Started for Free</Link>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <h2>Pathfinder</h2>
              <p>Personalized learning for everyone</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h3>Product</h3>
                <ul>
                  <li><Link to="/">Features</Link></li>
                  <li><Link to="/">Pricing</Link></li>
                  <li><Link to="/">Testimonials</Link></li>
                  <li><Link to="/">FAQ</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>Company</h3>
                <ul>
                  <li><Link to="/">About Us</Link></li>
                  <li><Link to="/">Careers</Link></li>
                  <li><Link to="/">Blog</Link></li>
                  <li><Link to="/">Contact</Link></li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>Resources</h3>
                <ul>
                  <li><Link to="/">Help Center</Link></li>
                  <li><Link to="/">API Documentation</Link></li>
                  <li><Link to="/">Privacy Policy</Link></li>
                  <li><Link to="/">Terms of Service</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Pathfinder Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 