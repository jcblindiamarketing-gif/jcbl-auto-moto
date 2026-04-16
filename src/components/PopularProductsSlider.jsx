import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Link } from "react-router-dom";

import Loader from "../components/Loader";

import "swiper/css";
import "./PopularProducts.css";

const PopularProductsSlider = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://www.jcblautomoto.com/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
        {
          products(first: 10) {
            nodes {
              id
              name
              slug
              shortDescription
              image {
                sourceUrl
              }
            }
          }
        }
        `,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data?.data?.products?.nodes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // 🔥 Short description (7–8 words)
  const getShortText = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    const words = text.split(" ").slice(0, 8).join(" ");
    return words + "...";
  };

  return (
    <section className="products-section">
      <div className="container products-header">
        <div>
          <h2>Browse Our Best Sellers</h2>
          <p>
            Explore our wide range of automotive products designed for
            performance and durability.
          </p>
        </div>

        <button className="btn btn-blue">
          Download Catalogue
        </button>
      </div>

      <div className="container">

        {loading ? (
          <div className="full-loader">
            <Loader />
          </div>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={4}
            loop={true}
            speed={800} // 🔥 smoother animation
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // 🔥 better UX
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-card">

                  {/* IMAGE */}
                  <div className="product-image">
                    <img
                      src={
                        product.image?.sourceUrl ||
                        "https://via.placeholder.com/200"
                      }
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>

                  {/* TITLE */}
                  <h4>{product.name}</h4>

                  {/* DESCRIPTION */}
                  <p>{getShortText(product.shortDescription)}</p>

                  {/* 🔥 LOCAL ROUTING */}
                  <Link
                    to={`/product/${product.slug}`}
                    className="btn btn-blue inquire-btn-popular"
                  >
                    Inquire Now
                  </Link>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}

      </div>
    </section>
  );
};

export default PopularProductsSlider;