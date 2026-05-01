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

  const getShortText = (html) => {
    if (!html) return "";
    const text = html.replace(/<[^>]+>/g, "");
    return text.split(" ").slice(0, 8).join(" ") + "...";
  };

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const res = await fetch(
        "https://www.jcblautomoto.com/wp-json/wp/v2/product?per_page=10&_embed"
      );

      const data = await res.json();

      console.log("REST API:", data);

      // ✅ Filter products WITH image only
      const filtered = data.filter(
        (item) => item._embedded?.["wp:featuredmedia"]?.[0]?.source_url
      );

      // ✅ Take only first 5 AFTER filtering
      const formatted = filtered.slice(0, 5).map((item) => ({
        id: item.id,
        name: item.title.rendered,
        slug: item.slug,
        shortDescription: item.excerpt.rendered,
        image: item._embedded["wp:featuredmedia"][0].source_url,
      }));

      setProducts(formatted);
    } catch (error) {
      console.error("Fetch error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  fetchProducts();
}, []);

  return (
    <section className="products-section">
      <div className="container products-header">
        <h2>Browse Our Best Sellers</h2>
      </div>

      <div className="container">
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <p>No products available</p>
        ) : (
          <Swiper
            modules={[Autoplay]}
            spaceBetween={20}
            slidesPerView={4}
            loop={true}
            autoplay={{ delay: 2500 }}
            breakpoints={{
              0: { slidesPerView: 1 },
              600: { slidesPerView: 2 },
              1024: { slidesPerView: 4 },
            }}
          >
            {products.map((product) => (
              <SwiperSlide key={product.id}>
                <div className="product-card">

                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                  </div>

                  <h4 dangerouslySetInnerHTML={{ __html: product.name }} />
                  <p
                    dangerouslySetInnerHTML={{
                      __html: getShortText(product.shortDescription),
                    }}
                  />

                  <Link
                    to={`/product/${product.slug}`}
                    className="category-btn btn-blue btn product-btn"
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