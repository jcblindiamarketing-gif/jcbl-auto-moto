"use client";

import React from "react";import Link from "next/link";
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

import "./Footer.css";
const Footer = () => {




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
  src="/images/JCBL-logo-header.png"
  alt="JCBL Logo"
  width={80}
  height={80}
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
  <li>
    <Link href="/">Home</Link>
  </li>

  <li>
    <Link href="/products">Products</Link>
  </li>

  <li>
    <Link href="/contact-us">Contact</Link>
  </li>

  <li>
    <Link href="/gallery">Gallery</Link>
  </li>


</ul>
        </div>

        {/* COLUMN 3 */}
        <div className="footer-products">
          <h4>Product Categories</h4>

          <ul>
               <li>
              <Link href="/category/car-spare-parts">
                Car Spare Parts
              </Link>
            </li>
            <li>
              <Link href="/category/chrome-parts">
                Chrome Parts
              </Link>
            </li>

           <li>
              <Link href="/category/heavy-machinery-parts">
                Heavy Machinery Parts
              </Link>
            </li>
           <li>
              <Link href="/category/tractor-part">
               Tractor Part
              </Link>
            </li>

                  <li>
              <Link href="/category/lubricants-engine-oil">
             Lubricants
              </Link>
            </li>

     
            <li>
              <Link href="/category/automotive-battery">
                Batteries
              </Link>
            </li>

            <li>
              <Link href="/category/motorcycle-spare-parts">
              Motorcycle Spare Parts
              </Link>
            </li>
      
            <li>
              <Link href="/category/car-alloy-wheels">
             Car Alloy Wheels
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
              1st Floor, Plot No.580,
              <br />
              Phase- 9, Industrial Area, Sector 66, <br /> Sahibzada Ajit Singh Nagar, <br /> Punjab 160062
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