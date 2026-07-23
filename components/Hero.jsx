"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Link from "next/link";
import Image from "next/image";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import heroShape from "../assets/images/hero-image-shape.svg";
import img1 from "../assets/images/slider-img-1.webp";
import img2 from "../assets/images/slider-img-2.webp";
import img3 from "../assets/images/slider-img-3.webp";
import img4 from "../assets/images/slider-img-4.webp";
import img5 from "../assets/images/slider-img-5.webp";

import "./Hero.css";

const sliderData = [
  { id: 1, image: img1 },
  { id: 2, image: img2 },
  { id: 3, image: img3 },
  { id: 4, image: img4 },
  { id: 5, image: img5 },
];

function Hero({ openCatalogue }) {
  return (
    <section
      className="hero"
      style={{
        backgroundImage: 'url("./assets/images/hero-bg-dotted-img.png")',
      }}
    >
<Image
  src={heroShape}
  alt="shape"
  className="hero-shape"
/>

      <div className="container hero-layout">
        <div className="hero-left">
          <div className="hero-text">
            <h1 className="hero-title">
              <span>JCBL India :</span>
              <br />
              Automotive Spare Parts Supplier From India
            </h1>

            <p className="hero-description">
              Delivering reliable automotive spare parts that empower global
              businesses with quality, consistency, and long-term market
              confidence.
            </p>

            <div className="hero-buttons">
              <Link href="/contact-us" className="btn btn-blue">
                Contact Us
              </Link>

              <button
                className="btn btn-border"
                onClick={openCatalogue}
              >
                Download Catalogue
              </button>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-frame">
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1}
              loop={true}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
              }}
            >
              {sliderData.map((item) => (
                <SwiperSlide key={item.id}>
                  <Image
                    src={item.image}
                    alt={`slide-${item.id}`}
                    width={800}
                    height={600}
                    priority={item.id === 1}
                    style={{
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;