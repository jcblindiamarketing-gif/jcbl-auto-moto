import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";

import Contact from "./pages/Contact";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FooterCTA from "./components/FooterCTA";
import Loader from "./components/Loader";

import Home from "./pages/Home";
import About from "./pages/About";
import Post from "./pages/Post";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import SingleBlog from "./pages/SingleBlog";
import BlogList from "./pages/BlogList";

import "./index.css";

function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Loader + scroll reset
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
      window.scrollTo(0, 0);
    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // FIX: Lenis inside routing
  useEffect(() => {
    const lenis = new Lenis({
      smooth: true,
      lerp: 0.08,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [location.pathname]); // re-init on route change

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/post" element={<Post />} />
            <Route path="/blog/:slug" element={<SingleBlog />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/blogs" element={<BlogList />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>

          <FooterCTA />
          <Footer />
        </>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;