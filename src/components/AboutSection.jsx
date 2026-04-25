import "./AboutSection.css";
import aboutBg from "../assets/images/about-bg-img.png";
import partimage from "../assets/images/parts-image.png";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";


function AboutSection() {
  return (
    <section
      className="about-section"
      style={{ backgroundImage: `url(${aboutBg})` }}
    >
      <div className="container">
        <div className="about-card">

          {/* ABSOLUTE IMAGE */}
          <img src={partimage} alt="parts" className="about-part-img about-right" />
          
          {/* ABSOLUTE IMAGE */}
          <img src={partimage} alt="parts" className="about-part-img about-left" />


          <h2>About Us</h2>

          <p>
            At JCBL India AutoMoto, we combine OEM-standard manufacturing with deep
            industry expertise to deliver replacement spare parts you can trust.
            Our commitment to precision engineering, strict quality control, and
            a robust supply chain ensures consistent performance, perfect fitment,
            and timely delivery.
          </p>

          <p>
            Backed by the strength of the JCBL Group, we focus on building long-term
            partnerships by providing reliable products, responsive support, and
            solutions tailored to evolving market needs.
          </p>

      
<Link to="/about" className="btn about-btn white-btn">
  Learn More
  <FaArrowRight className="btn-icon" />
</Link>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;