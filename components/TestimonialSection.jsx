"use client";

import "./TestimonialSection.css";
import Image from "next/image";

import logoImg from "../assets/images/logo-testimonial.png";
import leftCol from "../assets/images/left-col.png";
import rightCol from "../assets/images/right-col.png";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import { FaStar } from "react-icons/fa";

const testimonials = [
  {
    name: "Jhon Doe",
    text: "We’ve been importing auto parts from this company for over two years. The product quality is excellent and shipments always arrive. Professional team and great customer support. Their spare parts meet international standards.",
  },
  {
    name: "Amit Sharma",
    text: "Highly reliable supplier. Their spare parts meet international standards and performance is outstanding. Great experience working with them.",
  },
];

function TestimonialSection() {
  return (
    <section className="testimonial-section">
      <div className="container">

        <div className="testimonial-header">
          <h2>What our Clients say</h2>
          <p>
            Discover how businesses across global markets trust JCBL India for reliable automotive spare parts, consistent quality, and dependable customer support.
          </p>
        </div>

        <div className="testimonial-content">

          <div
            className="testimonial-left"
            style={{
              "--left-quote": `url(${leftCol.src})`,
              "--right-quote": `url(${rightCol.src})`,
            }}
          >
            <Image
              src={logoImg}
              alt="logo"
              width={300}
              height={300}
            />
          </div>

          <div className="testimonial-right">

            <Swiper
              modules={[Navigation, Autoplay]}
              navigation
              autoplay={{ delay: 4000 }}
              loop
              className="testimonial-swiper"
            >
              {testimonials.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="testimonial-card">

                    <h3>{item.name}</h3>

                    <div className="stars">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>

                    <p>{item.text}</p>

                    <a href="#" className="read-more">
                      Read More
                    </a>

                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

          </div>

        </div>

      </div>
    </section>
  );
}

export default TestimonialSection;