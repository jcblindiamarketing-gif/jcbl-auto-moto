"use client";

import React from "react";
import "./FooterCTA.css";
import Link from "next/link";

import bgImage from "../assets/images/before_footer_bg_img.png";

const FooterCTA = () => {
  return (
    <section
      className="footer-cta"
      style={{
        backgroundImage: `url(${bgImage.src})`,
      }}
    >
      <div className="container footer-cta-container">

        <div className="footer-cta-content">
          <h2>
            JCBL India: Automotive Spare Parts Export Partner
          </h2>

          <p>
            JCBL India is the international face of the JCBL Group.
            With extensive manufacturing capabilities in India and a
            robust global export network, we provide high-quality
            automotive spare parts and components, supporting
            customers worldwide with competitive pricing,
            dependable supply chain solutions, and consistent
            product availability.
          </p>
        </div>

        <div className="footer-cta-btn">
          <Link href="/contact-us">
            <button className="btn btn-blue">
              Contact Us
            </button>
          </Link>
        </div>

      </div>
    </section>
  );
};

export default FooterCTA;