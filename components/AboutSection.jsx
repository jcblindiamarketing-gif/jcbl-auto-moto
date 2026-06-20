"use client";

import "./AboutSection.css";
import Image from "next/image";
import aboutBg from "../assets/images/about-bg-img.png";
import partimage from "../assets/images/parts-image.png";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";

function AboutSection() {
  return (
    <section
      className="about-section"
      style={{
        backgroundImage: `url(${aboutBg.src})`,
      }}
    >
      <div className="container">
        <div className="about-card">

          {/* ABSOLUTE IMAGE */}
          <Image
            src={partimage}
            alt="parts"
            width={250}
            height={250}
            className="about-part-img about-right"
          />

          {/* ABSOLUTE IMAGE */}
          <Image
            src={partimage}
            alt="parts"
            width={250}
            height={250}
            className="about-part-img about-left"
          />

          <h2>About Us</h2>

          <p>
            JCBL India is the international business division of JCBL Group and a trusted auto parts exporter serving customers across global markets. Backed by over 35 years of industrial excellence, JCBL Group (established in 1989) has grown into a diversified Indian conglomerate with expertise across Mobility Applications, Defense, Railway & Bus Components, Agriculture, and International Business.
          </p>

          <p>
            JCBL India Auto & Moto is a division of JCBL India that specializes in supplying high-quality automotive spare parts for passenger vehicles, commercial vehicles, motorcycles, tractors, and heavy machinery. As an experienced vehicle and auto spare parts exporter, we deliver replacement parts engineered to match OEM quality and specifications, ensuring reliable performance, durability, and precise fitment.
          </p>

          <p>
            Our strong international supply network has established us as a dependable automotive parts exporter from India, supporting distributors, importers, and automotive businesses with reliable sourcing solutions, consistent product availability, and long-term supply partnerships.
          </p>

          <Link href="/about-jcbl-group" className="btn about-btn white-btn">
            Learn More
            <FaArrowRight className="btn-icon" />
          </Link>

        </div>
      </div>
    </section>
  );
}

export default AboutSection;