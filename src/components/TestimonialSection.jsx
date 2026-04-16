import "./TestimonialSection.css";
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

        {/* Header */}
        <div className="testimonial-header">
          <h2>What our Clients say</h2>
          <p>
            See what our customers say about us. It really matters how good or bad
            we make it for evaluation to make JCBL India better.
          </p>
        </div>

        <div className="testimonial-content">

          {/* LEFT */}
          <div className="testimonial-left"   style={{
    "--left-quote": `url(${leftCol})`,
    "--right-quote": `url(${rightCol})`,
  }}    >
            <img src={logoImg} alt="logo" />
          </div>

          {/* RIGHT */}
          <div className="testimonial-right">

            <Swiper
              modules={[Navigation, Autoplay]}
              navigation={true}
              autoplay={{ delay: 4000 }}
              loop={true}
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

                    <a href="#" className="read-more">Read More</a>

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