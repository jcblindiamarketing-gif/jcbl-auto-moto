import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./BlogList.css";

const BlogList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const PER_PAGE = 9;

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `https://www.jcblautomoto.com/wp-json/wp/v2/posts?per_page=${PER_PAGE}&page=${page}&_embed`
        );

        const total = res.headers.get("X-WP-TotalPages");
        setTotalPages(Number(total));

        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
      window.scrollTo(0, 0);
    };

    fetchBlogs();
  }, [page]);

  return (
    <div className="blog-list-container">
      <h2 className="blog-list-heading">All Blogs</h2>

      <div className="blog-list-grid">
        {loading
          ? [...Array(9)].map((_, i) => (
              <div className="blog-list-card skeleton" key={i}>
                <div className="skeleton-img"></div>
                <div className="skeleton-text title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text short"></div>
              </div>
            ))
          : posts.map((post) => (
              <div className="blog-list-card" key={post.id}>
                <img
                  src={
                    post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
                    "https://via.placeholder.com/300"
                  }
                  alt={post.title.rendered}
                />

                <h3
                  dangerouslySetInnerHTML={{
                    __html: post.title.rendered,
                  }}
                />

                <p>
                  {post.excerpt.rendered
                    .replace(/<[^>]+>/g, "")
                    .slice(0, 120)}
                  ...
                </p>

                <Link to={`/blog/${post.slug}`} >
                  Read More
                </Link>
              </div>
            ))}
      </div>

      {!loading && (
        <div className="blog-list-pagination">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={page === i + 1 ? "active" : ""}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;