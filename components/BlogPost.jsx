
import Link from "next/link";
import Breadcrumb from "./Breadcrumb";
import "./BlogPost.css";

const formatDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
};
/**
 * @param {{
 *   post: any,
 *   latestPosts?: any[]
 * }} props
 */
const BlogPost = ({ post, latestPosts = [] }) => {
  if (!post) return null;

  const publishedDate = formatDate(post.date);
  const updatedDate = formatDate(post.modified);

  const isUpdated =
    post.date &&
    post.modified &&
    new Date(post.modified).getTime() >
      new Date(post.date).getTime();

  return (
    <>
      <Breadcrumb
        title={post.title.rendered.replace(/<[^>]+>/g, "")}
      />

      <div className="container blog-layout">
        <div className="blog-main">

          {/* Featured Image */}
          {post._embedded?.["wp:featuredmedia"]?.[0]?.source_url && (
            <div className="blog-featured-image">
              <img
                loading="lazy"
                src={post._embedded["wp:featuredmedia"][0].source_url}
                alt={post.title.rendered}
                className="featured-image"
              />
            </div>
          )}

          {/* Title */}
          <h1
            className="blog-title"
            dangerouslySetInnerHTML={{
              __html: post.title.rendered,
            }}
          />

          {/* Meta Info */}
          <div className="blog-meta">

            {publishedDate && (
              <span className="blog-date">
                📅 Published: {publishedDate}
              </span>
            )}

            {isUpdated && updatedDate && (
              <span className="blog-date">
                🔄 Last Updated: {updatedDate}
              </span>
            )}

            {post._embedded?.author?.[0]?.name && (
              <span className="blog-author">
                ✍️ By JCBL India
              </span>
            )}

          </div>

          {/* Content */}
          <div className="blog-content-wrapper">
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{
                __html: post.cleanedContent,
              }}
            />
          </div>

          {/* Categories */}
          {post._embedded?.["wp:term"]?.[0] && (
            <div className="blog-categories">
              <h4>Categories:</h4>

              <div className="category-tags">
                {post._embedded["wp:term"][0].map((category) => (
                  <span
                    key={category.id}
                    className="category-tag"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Back to Blog Link */}
          <Link
            href="/blog"
            className="back-to-blog-bottom"
          >
            ← Back to All Blogs
          </Link>

        </div>

        {/* Sidebar */}
        <div className="blog-sidebar">
          <div className="sidebar-widget">

            <h3>Latest Blogs</h3>

            {latestPosts.length > 0 ? (
              latestPosts.map((item) => (
                <Link
                  href={`/blog/${item.slug}`}
                  key={item.id}
                  className="sidebar-item"
                >
                  <img
                    loading="lazy"
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
              <p>No latest posts available.</p>
            )}

          </div>
        </div>

      </div>
    </>
  );
};

export default BlogPost;
