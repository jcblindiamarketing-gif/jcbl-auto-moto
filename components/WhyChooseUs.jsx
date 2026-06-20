import React from "react";
import { FaGlobe, FaUsers, FaCheckCircle, FaBoxes } from "react-icons/fa";
import "./WhyChooseUs.css";

const WhyChooseUs = ({ openCatalogue }) => {
  const data = [
    {
      icon: <FaGlobe />,
      title: "Global Reach",
      desc: "As an international auto parts exporter, we serve customers worldwide with reliable sourcing solutions, efficient logistics support, and dependable deliveries across diverse global markets."
    },
    {
      icon: <FaUsers />,
      title: "Expert Team",
      desc: "Our experienced professionals collaborate closely with customers to provide tailored solutions, responsive support, and reliable automotive parts supply that meets evolving business requirements."
    },
    {
      icon: <FaCheckCircle />,
      title: "Certified Quality",
      desc: "MSME, CE, and ISO certifications support our replacement automotive parts, ensuring durability, precise fitment, consistent performance, and compliance with strict international quality standards."
    },
    {
      icon: <FaBoxes />,
      title: "Wide Product Range",
      desc: "As a bulk automotive components exporter, we offer a comprehensive range of spare parts for automobiles, motorcycles, tractors, commercial vehicles, and heavy machinery."
    }
  ];

  return (
    <section className="why-section">
      <div className="container why-header">
        <div>
          <h2>Why Choose Us</h2>
          <p>
    Backed by over 35 years of JCBL Group expertise, we deliver high-quality automotive spare parts solutions trusted by distributors, importers, and businesses across international markets.
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