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

  import "./index.css";

  /* 🔥 ROUTE WRAPPER (LOADER LOGIC HERE) */
  function AppContent() {
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      setLoading(true);

      const timer = setTimeout(() => {
        setLoading(false);
      }, 3000); // 🔥 3 seconds loader

      return () => clearTimeout(timer);
    }, [location.pathname]);

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
  <Route path="/product/:slug" element={<ProductDetail />} />
  <Route path="/category/:slug" element={<CategoryPage />} />
  
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

    // ✅ LENIS SMOOTH SCROLL
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
    }, []);

    return (
      <Router>
        <div className="app">
          <AppContent />
        </div>
      </Router>
    );
  }

  export default App;