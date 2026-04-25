import React from "react";
import "./FooterCTA.css";
import bgImage from "../assets/images/before_footer_bg_img.png";
import { Link } from "react-router-dom";

const FooterCTA = () => {
  return (
    <section
      className="footer-cta"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="container footer-cta-container">

        <div className="footer-cta-content">
          <h2>JCBL INDIA: Automotive Spare Parts</h2>

          <p>
            JCBL India is an International face of JCBL Group. It comprises
            different product divisions and currently exporting its products to
            South East Asia, the Middle East, Africa, Europe, South America,
            the USA. Auto and Moto Division is the one-stop destination for the
            complete range of Auto Moto Parts/Accessories, Batteries and Lubricants.
          </p>
        </div>

        <div className="footer-cta-btn">
        <Link to="/contact">
  <button className="btn btn-blue">Contact Us</button>
</Link>
        </div>

      </div>
    </section>
  );
};

export default FooterCTA;