import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules"; 
import { Link } from "react-router-dom";
import shapeImg from "../assets/images/shape-hero-img.png";
import "../index.css";
import heroBg from "../assets/images/hero-bg-dotted-img.png";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
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
  { id: 5, image: img5 }
];

function Hero({openCatalogue }) {
  return (
    <section className="hero"   style={{ backgroundImage: `url(${heroBg})` }}>
      <img src={shapeImg} alt="shape" className="hero-shape" />

      <div className="container hero-layout">

        {/* LEFT CONTENT */}
        <div className="hero-left">
          <div className="hero-text">

         

            <h1 className="hero-title">
              JCBL India : Automotive Spare Parts <br />
              <span>Supplier From India</span>
            </h1>

            <p className="hero-description">
              Get all automotive replacement spare parts meeting international standards.
              We ensure our customers are well-equipped to meet their market needs.
            </p>

            <div className="hero-buttons">
              <Link to="/contact" className="btn btn-blue">
                Contact Us
              </Link>

            <button className="btn btn-border" onClick={openCatalogue}>
  Download Catalogue
</button>
            </div>

          </div>
        </div>

        {/* RIGHT SIDE SLIDER */}
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
      <img src={item.image} alt={`slide-${item.id}`} />
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