"use client";

import "./BrandSection.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

// Image imports
import bajajLogo from "../assets/images/New folder/bajaj-bike.webp";
import tvsLogo from "../assets/images/New folder/tvs-bike.webp";
import chevroletLogo from "../assets/images/New folder/chevrolet.webp";
import escortsLogo from "../assets/images/New folder/excorts.webp";
import hondaLogo from "../assets/images/New folder/honda.webp";
import hyundaiLogo from "../assets/images/New folder/hyundai.webp";
import johnDeereLogo from "../assets/images/New folder/john-deere.webp";
import mahindraLogo from "../assets/images/New folder/mahindra.webp";
import masseyLogo from "../assets/images/New folder/messey.webp";
import newHollandLogo from "../assets/images/New folder/new-holand.webp";
import nissanLogo from "../assets/images/New folder/nissan.webp";
import sonalikaLogo from "../assets/images/New folder/sonalika.webp";
import suzukiLogo from "../assets/images/New folder/suzuki.webp";
import swarajLogo from "../assets/images/New folder/swaraj.webp";
import tataLogo from "../assets/images/New folder/tata.webp";

// Car brands
const carBrands = [
  { name: "Chevrolet", logo: chevroletLogo },
  { name: "Hyundai", logo: hyundaiLogo },
  { name: "Nissan", logo: nissanLogo },
  { name: "Tata", logo: tataLogo },
  { name: "Honda", logo: hondaLogo }, // Honda makes both cars and bikes
];

// Motorcycle brands
const motorcycleBrands = [
  { name: "Bajaj", logo: bajajLogo },
  { name: "Honda", logo: hondaLogo },
  { name: "Suzuki", logo: suzukiLogo },
  { name: "TVS", logo: tvsLogo },
];

// Tractor brands
const tractorBrands = [
  { name: "Escorts", logo: escortsLogo },
  { name: "John Deere", logo: johnDeereLogo },
  { name: "Mahindra", logo: mahindraLogo },
  { name: "Massey Ferguson", logo: masseyLogo },
  { name: "New Holland", logo: newHollandLogo },
  { name: "Sonalika", logo: sonalikaLogo },
  { name: "Swaraj", logo: swarajLogo },
];

// Combine all brands (cars first, then motorcycles, then tractors)
const brands = [...carBrands, ...motorcycleBrands, ...tractorBrands];

export default function BrandSection() {
  return (
    <section className="brand-section">
      <div className="container">
        <div className="brand-header">
          <h2>
            We Deal in Genuine Quality Replacement Parts for Leading Automotive
            Brands
          </h2>

          <p>
            JCBL India is a trusted automotive parts supplier offering
            genuine-quality replacement spare parts for automobiles, 2-wheelers,
            3-wheelers, 4-wheelers, tractors, and heavy machinery.
          </p>
        </div>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={5}
          loop={true}
          speed={4000}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 2 },
            576: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
          }}
        >
          {brands.map((brand, index) => (
            <SwiperSlide key={index}>
              <div className="brand-card">
                <img
                  src={brand.logo.src}
                  alt={brand.name}
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}