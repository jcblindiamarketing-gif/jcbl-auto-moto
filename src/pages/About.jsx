import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

// Image with fallback component
const ImageWithFallback = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = React.useState(src);
  const [error, setError] = React.useState(false);

  const handleError = () => {
    if (!error) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      onError={handleError}
    />
  );
};

function About() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="container">
          <div className="about-hero-content">
            <h1>About JCBL Automoto</h1>
            <p>India's Leading Manufacturer & Supplier of Automotive Spare Parts</p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="about-intro section">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-content">
              <h2>Who We Are</h2>
              <p>
                JCBL Automoto is a premier manufacturer and supplier of high-quality automotive spare parts, 
                serving clients across India and international markets. With decades of experience in the 
                automotive industry, we have established ourselves as a trusted partner for replacement parts 
                that meet international standards.
              </p>
              <p>
                Our commitment to excellence, innovation, and customer satisfaction drives everything we do. 
                We take pride in our ability to deliver products that ensure optimal performance, durability, 
                and reliability for all types of vehicles.
              </p>
              <div className="stats">
                <div className="stat-item">
                  <h3>25+</h3>
                  <p>Years of Excellence</p>
                </div>
                <div className="stat-item">
                  <h3>500+</h3>
                  <p>Happy Clients</p>
                </div>
                <div className="stat-item">
                  <h3>50+</h3>
                  <p>Countries Served</p>
                </div>
                <div className="stat-item">
                  <h3>1000+</h3>
                  <p>Products</p>
                </div>
              </div>
            </div>
            <div className="intro-image">
              <img 
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="JCBL Automoto Factory"
                className="about-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="mission-vision section">
        <div className="container">
          <div className="mv-grid">
            <div className="mv-card">
              <div className="mv-icon">🎯</div>
              <h3>Our Mission</h3>
              <p>
                To provide superior quality automotive spare parts that exceed customer expectations, 
                ensuring safety, reliability, and performance in every product we deliver.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">👁️</div>
              <h3>Our Vision</h3>
              <p>
                To become the most trusted automotive spare parts manufacturer globally, known for 
                innovation, quality excellence, and sustainable practices.
              </p>
            </div>
            <div className="mv-card">
              <div className="mv-icon">⭐</div>
              <h3>Our Values</h3>
              <p>
                Integrity, Innovation, Quality, Customer Focus, and Sustainability are the core 
                values that guide our business decisions and relationships.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="manufacturing section">
        <div className="container">
          <div className="manufacturing-grid">
            <div className="manufacturing-content">
              <h2>Manufacturing Excellence</h2>
              <p>
                Our state-of-the-art manufacturing facility is equipped with advanced machinery 
                and technology to produce precision-engineered automotive components.
              </p>
              <ul className="features-list">
                <li>✓ ISO 9001:2015 Certified Facility</li>
                <li>✓ Advanced Quality Control Systems</li>
                <li>✓ In-house Testing Laboratory</li>
                <li>✓ Skilled Engineering Team</li>
                <li>✓ Continuous Innovation & R&D</li>
                <li>✓ Sustainable Manufacturing Practices</li>
              </ul>
              <Link to="/contact" className="btn btn-yellow">
                <span>Partner With Us</span>
              </Link>
            </div>
            <div className="manufacturing-image">
              <img 
                src="https://images.unsplash.com/photo-1581092335871-5e2a9ac8c44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
                alt="Manufacturing Facility"
                className="about-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality Assurance */}
      <section className="quality section">
        <div className="container">
          <div className="quality-header">
            <h2>Quality Assurance</h2>
            <p>Our commitment to quality is unwavering</p>
          </div>
          <div className="quality-grid">
            <div className="quality-card">
              <div className="quality-icon">🔬</div>
              <h4>Rigorous Testing</h4>
              <p>Every component undergoes strict quality checks before delivery</p>
            </div>
            <div className="quality-card">
              <div className="quality-icon">📋</div>
              <h4>International Standards</h4>
              <p>Products meet global quality benchmarks and specifications</p>
            </div>
            <div className="quality-card">
              <div className="quality-icon">🏭</div>
              <h4>Modern Infrastructure</h4>
              <p>Advanced manufacturing facility with cutting-edge technology</p>
            </div>
            <div className="quality-card">
              <div className="quality-icon">👥</div>
              <h4>Expert Team</h4>
              <p>Experienced professionals ensuring excellence at every step</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team section">
        <div className="container">
          <div className="team-header">
            <h2>Leadership Team</h2>
            <p>Meet the experts driving our success</p>
          </div>
          <div className="team-grid">
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Rahul Sharma"
                  className="team-photo"
                />
              </div>
              <h4>Rahul Sharma</h4>
              <p>Managing Director</p>
              <span>25+ years experience</span>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Priya Mehta"
                  className="team-photo"
                />
              </div>
              <h4>Priya Mehta</h4>
              <p>Head of Operations</p>
              <span>18+ years experience</span>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Amit Kumar"
                  className="team-photo"
                />
              </div>
              <h4>Amit Kumar</h4>
              <p>Quality Director</p>
              <span>20+ years experience</span>
            </div>
            <div className="team-card">
              <div className="team-image">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Neha Singh"
                  className="team-photo"
                />
              </div>
              <h4>Neha Singh</h4>
              <p>Head of R&D</p>
              <span>15+ years experience</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Partner With Us?</h2>
            <p>Join hundreds of satisfied clients who trust JCBL Automoto for their automotive needs</p>
            <Link to="/contact" className="btn btn-white">
              <span>Contact Us Today</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;