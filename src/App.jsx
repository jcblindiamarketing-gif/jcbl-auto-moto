import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
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
  const lenisRef = useRef(null);

  // 🔥 Loader + scroll reset
  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);

      // reset scroll
      window.scrollTo(0, 0);
      
      // Update Lenis after route change if it exists
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
        setTimeout(() => {
          lenisRef.current.resize();
        }, 100);
      }

      // 🔥 force recalculation after route change
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 300);

    }, 800);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  // 🔥 FIXED LENIS - WITHOUT BLOCKING WHEEL EVENTS
  useEffect(() => {
    // Small delay to ensure DOM is fully rendered
    const initLenis = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }

      const lenis = new Lenis({
        smooth: true,
        lerp: 0.1,
        duration: 1.2,
        smoothTouch: true,
        touchMultiplier: 2,
        wheelMultiplier: 1,
        normalizeWheel: false, // 🔥 CHANGED: Don't normalize wheel to avoid conflicts
        infinite: false,
        gestureOrientation: "vertical",
        // 🔥 IMPORTANT: Don't prevent default on all wheel events
        autoResize: true,
      });

      lenisRef.current = lenis;

      // Connect Lenis to wheel events without blocking
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      
      requestAnimationFrame(raf);

      // 🔥 FIX: Recalculate scrollable height on resize and after content loads
      const updateLenis = () => {
        if (lenisRef.current) {
          lenisRef.current.resize();
        }
      };

      // Watch for DOM changes that might affect height
      const resizeObserver = new ResizeObserver(() => {
        updateLenis();
      });

      // Observe body for content changes
      resizeObserver.observe(document.body);
      
      window.addEventListener("resize", updateLenis);
      
      // Also update after images load
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        if (img.complete) {
          updateLenis();
        } else {
          img.addEventListener('load', updateLenis);
        }
      });

      // Force update after delays
      setTimeout(updateLenis, 100);
      setTimeout(updateLenis, 500);
      setTimeout(updateLenis, 1000);

      return () => {
        window.removeEventListener("resize", updateLenis);
        resizeObserver.disconnect();
        if (lenisRef.current) {
          lenisRef.current.destroy();
        }
      };
    }, 100);

    return () => clearTimeout(initLenis);
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Header />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-jcbl-group" element={<About />} />
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