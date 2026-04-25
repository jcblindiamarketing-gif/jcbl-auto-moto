import React from "react";
import { FaGlobe, FaUsers, FaCheckCircle, FaBoxes } from "react-icons/fa";
import "./WhyChooseUs.css";

const WhyChooseUs = ({ openCatalogue }) => {
  const data = [
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      desc: "With over 34+ years of expertise, JCBL India serves clients across the globe, providing a reliable source for high-quality automotive replacement spare parts."
    },
    {
      icon: <FaUsers />,
      title: "Expert Team",
      desc: "Our team of 100+ skilled professionals and engineers is committed to offering tailored solutions for all your automotive spare parts needs."
    },
    {
      icon: <FaCheckCircle />,
      title: "Unmatched Quality",
      desc: "Adhering to the highest quality standards, we ensure precision, durability, and reliability across all our products and services."
    },
    {
      icon: <FaBoxes />,
      title: "Wide Product Range",
      desc: "We provide an extensive range of automotive parts including components for two-wheelers, tractors, and heavy machinery."
    }
  ];

  return (
    <section className="why-section">
      <div className="container why-header">
        <div>
          <h2>Why Choose Us</h2>
          <p>
            JCBL Group is a leading business conglomerate. From an early foray
            into mobility solutions space to staying abreast of the latest technologies
          </p>
        </div>

        <button className="btn btn-blue" onClick={openCatalogue}>Download Catalogue</button>
      </div>

      <div className="container why-cards">
        {data.map((item, index) => (
          <div className="why-card" key={index}>
            <div className="why-icon">{item.icon}</div>
            <h4>{item.title}</h4>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyChooseUs;