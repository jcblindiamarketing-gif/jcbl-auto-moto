import React from "react";
import Link from "next/link";
import "./Breadcrumb.css";

const bgImage = "/assets/images/JCBL-group-img.jpg";

const Breadcrumb = ({ title }) => {
  return (
    <div
      className="breadcrumb-section"
      style={{
        backgroundImage: `url('${bgImage}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="overlay"></div>

      <div className="container breadcrumb-content">
       <span className="breadcrumb-title">{title}</span>

        <div className="breadcrumb-links">
          <Link href="/">Home</Link>
          <span> / </span>
          <span>{title}</span>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;