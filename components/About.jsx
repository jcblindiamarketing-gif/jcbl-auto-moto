"use client";

import React from "react";
import Image from "next/image";
import Breadcrumb from "../components/Breadcrumb";
import "./About.css";

import {
  FaIndustry,
  FaCar,
  FaGlobe,
  FaChartLine,
  FaHandshake,
  FaAward,
  FaArrowTrendUp,
  FaPeopleGroup,
  FaShieldHalved,
  FaHeadset,
  FaBullseye,
  FaLightbulb,
  FaHeart,
  FaHandsHoldingCircle,
  FaMagnifyingGlass,
  FaRocket,
  FaBolt,
} from "react-icons/fa6";

const aboutHero = "/assets/images/about-hero.jpg";
const groupImage = "/assets/images/JCBL-group-img.jpg";

export default function About() {
  return (
    <div className="about-page">
      <Breadcrumb title="About Us" />

      {/* Hero Section */}
      <section className="about-hero-section">
        <div className="container">
          <div className="about-hero-content">
            <div className="about-hero-text">
              <h1>About JCBL India</h1>
              <p>
                JCBL India is the international business division of JCBL Group and a trusted 
                auto parts exporter serving customers across global markets. Backed by over 35 years of 
                industrial excellence, JCBL Group (established in 1989) has grown into a diversified 
                Indian conglomerate with expertise across Mobility Applications, Defense, Railway & Bus 
                Components, Agriculture, and International Business.
              </p>
              <p>
                JCBL India Auto & Moto is a division of JCBL India that specializes in supplying 
                high-quality automotive spare parts for passenger vehicles, commercial vehicles, 
                motorcycles, tractors, and heavy machinery. As an experienced vehicle and auto spare 
                parts exporter, we deliver replacement parts engineered to match OEM quality and 
                specifications, ensuring reliable performance, durability, and precise fitment.
              </p>
              <p>
                Our strong international supply network has established us as a dependable automotive 
                parts exporter from India, supporting distributors, importers, and automotive businesses 
                with reliable sourcing solutions, consistent product availability, and long-term supply 
                partnerships.
              </p>
              <div className="hero-stats">
                <div className="hero-stat">
                  <FaAward className="stat-icon"/>
                  <span className="stat-number">35+</span>
                  <span className="stat-label">Years of Excellence</span>
                </div>
                <div className="hero-stat">
                  <FaGlobe className="stat-icon"/>
                  <span className="stat-number">50+</span>
                  <span className="stat-label">Global Markets</span>
                </div>
                <div className="hero-stat">
                  <FaHandshake className="stat-icon"/>
                  <span className="stat-number">500+</span>
                  <span className="stat-label">Happy Partners</span>
                </div>
              </div>
            </div>
            <div className="about-hero-image">
              <Image
                src={aboutHero}
                alt="JCBL India Auto Moto Hero"
                width={600}
                height={400}
                className="hero-img"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="our-story-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Story</h2>
            <div className="section-line"></div>
          </div>
          <div className="story-content">
            <p>
              JCBL India was founded with a clear vision: to bridge global demand with dependable 
              automotive spare parts sourcing solutions from India. Built on the strong foundation of 
              JCBL Group, we are committed to helping distributors, importers, and automotive businesses 
              access reliable replacement parts backed by consistency, transparency, and long-term value.
            </p>
            <p>
              Over the years, we have expanded our presence across international markets by focusing on 
              customer requirements, operational reliability, and sustainable business relationships. 
              Our approach goes beyond supplying products, we strive to be a trusted partner that supports 
              business growth through dependable service, market understanding, and supply chain excellence.
            </p>
            <p>
              Today, JCBL India continues to strengthen its global footprint while helping customers 
              source quality replacement parts with confidence and build long-term success in their 
              respective markets.
            </p>
          </div>
        </div>
      </section>

      {/* What Sets Us Apart Section */}
      <section className="apart-section">
        <div className="container">
          <div className="section-header">
            <h2>What Sets Us Apart</h2>
            <div className="section-line"></div>
          </div>
          <div className="apart-grid">
            <div className="apart-card">
              <FaIndustry className="apart-icon" />
              <h3>35+ Years of Industrial Excellence</h3>
              <p>Backed by decades of experience, expertise, and operational excellence through the JCBL Group.</p>
            </div>
            <div className="apart-card">
              <FaCar className="apart-icon" />
              <h3>Diverse Product Coverage Across Vehicle Segments</h3>
              <p>Supporting the spare parts requirements of automobiles, 2-wheelers, 3-wheelers, 4-wheelers, tractors, and heavy machinery.</p>
            </div>
            <div className="apart-card">
              <FaGlobe className="apart-icon" />
              <h3>Reliable Sourcing & Supply Capabilities</h3>
              <p>Ensuring consistent product availability through a dependable sourcing and supply network.</p>
            </div>
            <div className="apart-card">
              <FaChartLine className="apart-icon" />
              <h3>Understanding of International Market Requirements</h3>
              <p>Serving diverse global markets with solutions aligned to varying customer and industry needs.</p>
            </div>
            <div className="apart-card">
              <FaHandshake className="apart-icon" />
              <h3>Commitment to Sustainable Business Partnerships</h3>
              <p>Building long-term relationships through trust, consistency, and shared business growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="why-choose-section">
        <div className="container">
          <div className="why-choose-wrapper">
            <div className="why-choose-image">
              <Image
                src={groupImage}
                alt="JCBL Group"
                width={600}
                height={400}
                className="group-img"
              />
            </div>
            <div className="why-choose-content">
              <h2>Why Do Businesses Choose JCBL India?</h2>
              <div className="choose-grid">
                <div className="choose-item">
                  <FaAward className="choose-icon" />
                  <div>
                    <h4>Industrial Legacy</h4>
                    <p>As part of the JCBL Group, we leverage decades of industrial expertise, business stability, and operational excellence across multiple sectors.</p>
                  </div>
                </div>
                <div className="choose-item">
                  <FaArrowTrendUp className="choose-icon" />
                  <div>
                    <h4>Market Selection</h4>
                    <p>Our portfolio is aligned with evolving market requirements, helping customers source relevant spare parts that support sustained business growth.</p>
                  </div>
                </div>
                <div className="choose-item">
                  <FaHandsHoldingCircle className="choose-icon" />
                  <div>
                    <h4>Flexible Approach</h4>
                    <p>We work closely with customers to address varying market demands, product requirements, and sourcing needs across regions.</p>
                  </div>
                </div>
                <div className="choose-item">
                  <FaShieldHalved className="choose-icon" />
                  <div>
                    <h4>Quality Compliance</h4>
                    <p>MSME, CE, and ISO certified systems ensure consistent quality, regulatory compliance, and reliable performance across all automotive spare parts.</p>
                  </div>
                </div>
                <div className="choose-item">
                  <FaHeart className="choose-icon" />
                  <div>
                    <h4>Long-Term Trust</h4>
                    <p>We prioritize trust, transparency, and consistency, building lasting relationships that create value for customers and business partners.</p>
                  </div>
                </div>
                <div className="choose-item">
                  <FaHeadset className="choose-icon" />
                  <div>
                    <h4>Global Support</h4>
                    <p>From export documentation to shipment coordination, we simplify international procurement processes to support seamless cross-border business.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section */}
      <section className="vision-mission-section">
        <div className="container">
          <div className="vision-mission-grid">
            <div className="vision-box">
              <FaBullseye className="vm-icon" />
              <h3>Our Vision</h3>
              <p>Creating a Benchmark across the Globe in Delivering Value with Versatility.</p>
            </div>
            <div className="mission-box">
              <FaLightbulb className="vm-icon" />
              <h3>Our Mission</h3>
              <ul>
                <li>✓ Enable, engage, and empower our people by continuously enhancing their skills, knowledge, and imbibing culture of Ownership.</li>
                <li>✓ Invest significantly in Product Finding, Innovation, and Analytics to keep upgrading our product offering.</li>
                <li>✓ Focus on Customer Engagement &amp; Communication process to build sustainable relationships.</li>
                <li>✓ Designing win-win solutions with vendors building them as Partners in Progress.</li>
                <li>✓ Increase depth with existing clients, acquire new customers, enter new segments and geographies.</li>
                <li>✓ Make organization system driven by refining existing Supply Chain processes and leverage IT to improve our efficiencies.</li>
                <li>✓ Building Internal &amp; External Brand Proposition that is compelling and credible.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="values-section">
        <div className="container">
          <div className="section-header">
            <h2>Our Values</h2>
            <div className="section-line"></div>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <FaHeart className="value-icon" />
              <h4>Customer First</h4>
              <p>Committed to timelines and quality in all that we do.</p>
            </div>
            <div className="value-card">
              <FaPeopleGroup className="value-icon" />
              <h4>Respect</h4>
              <p>Respect for clients, partners, employees and the environment.</p>
            </div>
            <div className="value-card">
              <FaHandsHoldingCircle className="value-icon" />
              <h4>Collaboration</h4>
              <p>Support &amp; evolve with each other for a better 'shared future'.</p>
            </div>
            <div className="value-card">
              <FaMagnifyingGlass className="value-icon" />
              <h4>Transparent</h4>
              <p>Steering business with honesty &amp; ethics.</p>
            </div>
            <div className="value-card">
              <FaRocket className="value-icon" />
              <h4>Intrapreneurial</h4>
              <p>Own it, commit to it and drive it.</p>
            </div>
            <div className="value-card">
              <FaBolt className="value-icon" />
              <h4>Agility</h4>
              <p>Adapt proactively &amp; respond rapidly to Present &amp; Future developments.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}