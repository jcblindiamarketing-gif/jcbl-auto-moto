import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./SingleBlog.css";

const SingleBlog = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [latestPosts, setLatestPosts] = useState([]);

  // fetch blog
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(
          `https://www.jcblautomoto.com/wp-json/wp/v2/posts?slug=${slug}&_embed`
        );
        const data = await res.json();

        if (data.length > 0) {
          const p = data[0];

          const cleanedContent = p.content.rendered
            .replace(/overflow\s*:\s*hidden/gi, "overflow:visible")
            .replace(/height\s*:\s*100vh/gi, "height:auto");

          setPost({ ...p, cleanedContent });
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchPost();
  }, [slug]);
useEffect(() => {
  if (post) {
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 200);
  }
}, [post]);
  // fetch only 3 latest blogs (FASTER)
  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await fetch(
          `https://www.jcblautomoto.com/wp-json/wp/v2/posts?per_page=3&_embed`
        );
        const data = await res.json();
        setLatestPosts(data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchLatest();
  }, []);

  return (
    <div className="container blog-layout">

      {/* LEFT BLOG */}
      <div className="blog-main">

        {/* IMAGE */}
        {post ? (
          <img
            src={
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
              "https://via.placeholder.com/600"
            }
            alt={post.title.rendered}
          />
        ) : (
          <div className="img-skeleton"></div>
        )}

        {/* TITLE */}
        {post ? (
          <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
        ) : (
          <div className="text-skeleton title"></div>
        )}

        {/* CONTENT */}
        {post ? (
          <div className="blog-content-wrapper">
            <div
              dangerouslySetInnerHTML={{
                __html: post.cleanedContent,
              }}
            />
          </div>
        ) : (
          <div className="content-skeleton"></div>
        )}
      </div>

      {/* RIGHT SIDEBAR */}
      <div className="blog-sidebar">
        <h3>Latest Blogs</h3>

        {latestPosts.length > 0 ? (
          latestPosts.map((item) => (
            <Link
              to={`/blog/${item.slug}`}
              key={item.id}
              className="sidebar-item"
            >
              <img
                src={
                  item._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                  "https://via.placeholder.com/100"
                }
                alt={item.title.rendered}
              />

              <div>
                <h4
                  dangerouslySetInnerHTML={{
                    __html: item.title.rendered,
                  }}
                />

                <p>
                  {item.excerpt.rendered
                    .replace(/<[^>]+>/g, "")
                    .split(" ")
                    .slice(0, 6)
                    .join(" ")}
                  ...
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default SingleBlog;