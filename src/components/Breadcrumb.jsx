import React from "react";
import { Link } from "react-router-dom";
import bgImage from "../assets/images/JCBL-group-img.jpg";
import "./Breadcrumb.css";

const Breadcrumb = ({ title }) => {
  return (
    <div
      className="breadcrumb-section"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="overlay"></div>

      <div className="container breadcrumb-content">
        <h1>{title}</h1>

        <div className="breadcrumb-links">
          <Link to="/">Home</Link>
          <span> / </span>
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;