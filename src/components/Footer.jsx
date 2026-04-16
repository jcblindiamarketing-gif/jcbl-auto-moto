import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import logo from "../assets/images/JCBL-logo-header.png";
import "./Footer.css";

const Footer = () => {
  const [menuItems, setMenuItems] = useState([]);

  const getPath = (url) => {
    try {
      return new URL(url).pathname;
    } catch {
      return "/";
    }
  };
useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await fetch("https://www.jcblautomoto.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            {
              menu(id: "main-menu", idType: SLUG) {
                menuItems {
                  nodes {
                    id
                    label
                    url
                    parentId
                  }
                }
              }
            }
          `,
        }),
      });

      const data = await res.json();

      const items = data?.data?.menu?.menuItems?.nodes || [];

      // ✅ only top-level items (no dropdown / mega menu)
      const mainMenu = items.filter(item => !item.parentId);

      setMenuItems(mainMenu);

    } catch (err) {
      console.error("Menu Error:", err);
      setMenuItems([]);
    }
  };

  fetchMenu();
}, []);
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-left">
          <img src={logo} alt="logo" className="footer-logo" />

          <h3>JCBL India Auto & Moto</h3>
          <p>
            JCBL India AutoMoto is a renowned and trusted supplier specializing
            in genuine quality replacement spare parts for Auto parts, 2–3
            Wheeler parts, Tractor parts, Heavy Machinery spare parts.
          </p>

          <div className="footer-contact">
           <p>
  <span className="icon-circle"><FaPhoneAlt /></span>
  <a href="tel:+918968100180">+91-8968100180</a>,{" "}
  <a href="tel:+918288076221">+91-8288076221</a>
</p>
            <p>
              <span className="icon-circle"><FaEnvelope /></span>
              <a href="mailto:sales@jcblautomoto.com">sales@jcblautomoto.com</a>
            </p>
            <p>
              <span className="icon-circle"><FaMapMarkerAlt /></span>
              Plot No. 580, Phase 9, Industrial Area, <br/>Sector 66, Punjab 160062, India
            </p>
          </div>
        </div> {/* ✅ FIX: closed footer-left */}

        {/* MIDDLE */}
        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <li key={item.id}>
                  <Link to={getPath(item.url)}>
                    {item.label}
                  </Link>
                </li>
              ))
            ) : (
              <li>Loading...</li>
            )}
          </ul>
        </div>

        {/* RIGHT */}
      <div className="footer-products">
  <h4>Product Categories</h4>
  <ul>
    <li><Link to="/category/chrome-parts">Chrome Parts</Link></li>
    <li><Link to="/category/car-spare-parts">Car Spare Parts</Link></li>
    <li><Link to="/category/motorcycle-alloy-wheels">Motorcycle Alloy Wheels</Link></li>
    <li><Link to="/category/helmets">Helmets</Link></li>
    <li><Link to="/category/heavy-machinery-parts">Heavy Machinery Parts</Link></li>
    <li><Link to="/category/truck-parts">Truck Parts</Link></li>
    <li><Link to="/category/lubricants">Lubricants</Link></li>
    <li><Link to="/category/automotive-battery">Batteries</Link></li>
    <li><Link to="/category/alloy-wheels">Alloy Wheels</Link></li>
  </ul>
</div>

      </div>

      <div className="footer-bottom">
        © 2026 JCBL Auto Moto. All rights reserved
      </div>
    </footer>
  );
};

export default Footer;