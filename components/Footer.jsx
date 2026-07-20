"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { FaWhatsapp } from "react-icons/fa";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";

import logo from "../assets/images/JCBL-logo-header.png";
import "./Footer.css";

const Footer = () => {
  const [menuItems, setMenuItems] = useState([]);

  const MENU_API =
    "https://api.jcblautomoto.com/wp-json/custom/v1/menu";

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
        const res = await fetch(MENU_API);

        if (!res.ok) {
          throw new Error("Menu API failed");
        }

        const data = await res.json();

        const mainMenu = (data || []).filter(
          (item) =>
            item.url &&
            item.label !== "dgwt_wcas_search_box" &&
            !item.url.includes("/category/")
        );

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
      <a
        href="https://wa.me/918968100180"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float"
      >
        <FaWhatsapp />
      </a>

      <div className="footer-container">

        {/* COLUMN 1 */}
        <div className="footer-left">

          <Image
            src={logo}
            alt="JCBL Logo"
            width={220}
            height={80}
            className="footer-logo"
            priority
          />

          <h3>JCBL India Auto & Moto</h3>

          <p>
            JCBL India is a renowned and trusted supplier
            specializing in genuine-quality replacement
            spare parts for Auto parts, 2-3 wheeler parts,
            tractor parts, and heavy machinery spare parts.
          </p>

          <h3>Follow Us On</h3>

          <div className="footer-social">
            <a
              href="https://www.facebook.com/jcblautomoto/"
              target="_blank"
              rel="noreferrer"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://www.instagram.com/jcblautomoto/"
              target="_blank"
              rel="noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/in/jcblautomoto/"
              target="_blank"
              rel="noreferrer"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="https://x.com/jcblautomoto"
              target="_blank"
              rel="noreferrer"
            >
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* COLUMN 2 */}
        <div className="footer-links">
          <h4>Quick Links</h4>

          <ul>
            {menuItems.length > 0 ? (
              menuItems.map((item) => (
                <li key={item.id}>
                  <Link href={getPath(item.url)}>
                    {item.label}
                  </Link>
                </li>
              ))
            ) : (
              <li>Loading...</li>
            )}
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className="footer-products">
          <h4>Product Categories</h4>

          <ul>
            <li>
              <Link href="/category/chrome-parts">
                Chrome Parts
              </Link>
            </li>

            <li>
              <Link href="/category/car-spare-parts">
                Car Spare Parts
              </Link>
            </li>

            <li>
              <Link href="/category/motorcycle-alloy-wheels">
                Motorcycle Alloy Wheels
              </Link>
            </li>

           
            <li>
              <Link href="/category/heavy-machinery-parts">
                Heavy Machinery Parts
              </Link>
            </li>

            <li>
              <Link href="/category/truck-parts">
                Truck Parts
              </Link>
            </li>

            <li>
              <Link href="/category/lubricants">
                Lubricants
              </Link>
            </li>

            <li>
              <Link href="/category/automotive-battery">
                Batteries
              </Link>
            </li>

            <li>
              <Link href="/category/alloy-wheels">
                Alloy Wheels
              </Link>
            </li>
          </ul>
        </div>

        {/* COLUMN 4 */}
        <div className="footer-contact-col">
          <h4>Contact Details</h4>

          <div className="footer-contact">

            <p>
              <span className="icon-circle">
                <FaPhoneAlt />
              </span>
              <a href="tel:+918968100180">
                +91-8968100180
              </a>
            </p>

            <p>
              <span className="icon-circle">
                <FaPhoneAlt />
              </span>
              <a href="tel:+918288076221">
                +91-8288076221
              </a>
            </p>

            <p>
              <span className="icon-circle">
                <FaEnvelope />
              </span>
              <a href="mailto:sales@jcblautomoto.com">
                sales@jcblautomoto.com
              </a>
            </p>

            <p>
              <span className="icon-circle">
                <FaMapMarkerAlt />
              </span>
              Plot No. 580, Phase 9,
              Industrial Area,
              <br />
              Sector 66,
              Punjab 160062,
              India
            </p>

          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2026 JCBL Auto Moto.
        All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;