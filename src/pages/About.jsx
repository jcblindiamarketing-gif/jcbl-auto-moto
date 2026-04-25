import React from "react";
import { Link } from "react-router-dom";
import "./About.css";
import Breadcrumb from "../components/Breadcrumb";
import manufacturingImg from "../assets/images/manufacturing-parts-img.webp";

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

      {/* ✅ Breadcrumb instead of hero */}
      <Breadcrumb title="About Us" />

      {/* Company Introduction */}
      <section className="about-intro section">
        <div className="container">
          <div className="intro-grid">
            <div className="intro-content">
              <h2>Who We Are</h2>
              <p>
                JCBL Automoto is a premier manufacturer and supplier of high-quality automotive spare parts.
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
              </div>
            </div>

            <div className="intro-image">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1581091226033-d5c48150dbaa"
                fallbackSrc="https://via.placeholder.com/500"
                alt="Factory"
                className="about-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Manufacturing */}
      <section className="manufacturing section">
        <div className="container">
          <div className="manufacturing-grid">
  <div className="manufacturing-image">
             <ImageWithFallback
  src={manufacturingImg}
  fallbackSrc="https://via.placeholder.com/500"
  alt="Manufacturing"
  className="about-image"
/>
            </div>
            <div className="manufacturing-content">
              <h2>Manufacturing Excellence</h2>

              <ul className="features-list">
                <li> ISO Certified</li>
                <li>Quality Control</li>
                <li> Skilled Team</li>
              </ul>

              <Link to="/contact" className="btn btn-blue">
                Partner With Us
              </Link>
            </div>

          

          </div>
        </div>
      </section>

   

    </div>
  );
}

export default About;