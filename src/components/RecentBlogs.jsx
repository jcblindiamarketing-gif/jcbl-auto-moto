import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "./RecentBlogs.css";

const RecentBlogs = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch(
          "https://www.jcblautomoto.com/wp-json/wp/v2/posts?per_page=3&_embed"
        );

        if (!res.ok) throw new Error("Failed to fetch blogs");

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setPosts([]);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="blogs-section">
      <div className="container blogs-header">
        <h2>Recent Added Blogs</h2>
        <button className="btn btn-blue see-all-blog">See All</button>
      </div>

      <div className="container">
        {posts.length === 0 ? (
          <p>Loading blogs...</p>
        ) : (
          <Swiper
            modules={[Autoplay]}
            slidesPerView={1} // ✅ ALWAYS 1 slide
            spaceBetween={20}
            loop={true}
            speed={800}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
          >
            {posts.map((post) => (
              <SwiperSlide key={post.id}>
                <div className="blog-card">

                  {/* IMAGE */}
                  <div className="blog-image">
                    <img
                      src={
                        post._embedded?.["wp:featuredmedia"]?.[0]
                          ?.source_url ||
                        "https://via.placeholder.com/200"
                      }
                      alt={post.title.rendered}
                      loading="lazy"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="blog-content">
                    <span className="badge">Recently Added</span>

                    <h3
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />

                    <p>
                      {post.excerpt.rendered
                        .replace(/<[^>]+>/g, "")
                        .slice(0, 180)}
                      ...
                    </p>

                    <a href={post.link}>
                      <button className="btn btn-blue read-more-button">
                        Read More
                      </button>
                    </a>
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  );
};

export default RecentBlogs;