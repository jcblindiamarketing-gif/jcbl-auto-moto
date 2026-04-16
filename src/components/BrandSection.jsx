import "./BrandSection.css";

// Swiper imports
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";

import { Autoplay } from "swiper/modules";

// Image imports (.webp ONLY)
import bajajLogo from "../assets/images/bajaj-bike.webp";
import tvsLogo from "../assets/images/tvs-bike.webp";
import chevroletLogo from "../assets/images/chevrolet.webp";
import escortsLogo from "../assets/images/excorts.webp";
import hondaLogo from "../assets/images/honda.webp";
import hyundaiLogo from "../assets/images/hyundai.webp";
import johnDeereLogo from "../assets/images/john-deere.webp";
import mahindraLogo from "../assets/images/mahindra.webp";
import masseyLogo from "../assets/images/messey.webp";
import newHollandLogo from "../assets/images/new-holand.webp";
import nissanLogo from "../assets/images/nissan.webp";
import sonalikaLogo from "../assets/images/sonalika.webp";
import suzukiLogo from "../assets/images/suzuki.webp";
import swarajLogo from "../assets/images/swaraj.webp";
import tataLogo from "../assets/images/tata.webp";

const brands = [
  { name: "Bajaj", logo: bajajLogo },
  { name: "Chevrolet", logo: chevroletLogo },
  { name: "Escorts", logo: escortsLogo },
  { name: "Honda", logo: hondaLogo },
  { name: "Hyundai", logo: hyundaiLogo },
  { name: "John Deere", logo: johnDeereLogo },
  { name: "Mahindra", logo: mahindraLogo },
  { name: "Massey Ferguson", logo: masseyLogo },
  { name: "New Holland", logo: newHollandLogo },
  { name: "Nissan", logo: nissanLogo },
  { name: "Sonalika", logo: sonalikaLogo },
  { name: "Suzuki", logo: suzukiLogo },
  { name: "Swaraj", logo: swarajLogo },
  { name: "Tata", logo: tataLogo },
  { name: "TVS", logo: tvsLogo },
];

function BrandSection() {
  return (
    <section className="brand-section">
      <div className="container">

        <div className="brand-header">
          <h2>
            We deal in replacement parts 
            for the following brands.
          </h2>

          <p>
            We manufacture durable, precision-engineered spare parts trusted by
            leading tractor and automobile brands for reliable performance.
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
                  src={brand.logo}
                  alt={brand.name}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/fallback.png";
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}

export default BrandSection;