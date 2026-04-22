import { Link } from "react-router-dom";
import { useEffect, useContext, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { HiX } from "react-icons/hi";
import { useLocation } from "react-router-dom";
import { HiChevronRight } from "react-icons/hi";
import { MenuContext } from "../context/MenuContext";
import { HiPhone, HiMail } from "react-icons/hi";
import "./Header.css";
import logo from "../assets/images/JCBL-logo-header.png";

function Header() {

  const { menu, categories, loading } = useContext(MenuContext);
const location = useLocation();
  const [activeCat, setActiveCat] = useState(null);
  const [activeChild, setActiveChild] = useState(null); // ✅ FIXED
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);


useEffect(() => {
  setOpenMenu(false); // ✅ close menu when route changes
}, [location.pathname]);

 useEffect(() => {
  const handleClickOutside = (e) => {
    const isInsideMenu = e.target.closest(".dropdown.mega");

    // ✅ If click inside menu → do nothing
    if (isInsideMenu) return;

    setOpenMenu(false);
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);

  // SET DEFAULT PARENT
  useEffect(() => {
    if (categories.length > 0) {
      setActiveCat(categories[0].id);
    }
  }, [categories]);

  // ✅ SET DEFAULT CHILD
  useEffect(() => {
    const parent = categories.find(c => c.id === activeCat);
    if (parent?.children?.length) {
      setActiveChild(parent.children[0].id);
    }
  }, [activeCat, categories]);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // ✅ FIX CLICK ISSUE
  const toggleMegaMenu = (e) => {
    e.stopPropagation();
    setOpenMenu(prev => !prev);
  };

  return (
  <>
   {/* ===== TOP BAR START ===== */}
<div className="top-bar">
  <div className="container top-bar-wrapper">
    
    <div className="top-left">
      
      <a href="tel:+918968100180" className="contact-link">
        <HiPhone className="top-icon" />
        <span>+91-8968100180</span>
      </a>

      <a href="tel:+918288076221" className="contact-link">
        <HiPhone className="top-icon" />
        <span>+91-8288076221</span>
      </a>

    </div>

    <div className="top-right">
      <a href="mailto:Sales@jcblautomoto.com" className="contact-link">
        <HiMail className="top-icon" />
        <span>Sales@jcblautomoto.com</span>
      </a>
    </div>

  </div>
</div>
    <header className="header">
      <div className="container header-wrapper">

        {/* LOGO */}
        <div className="logo">
<Link to="/">
  <img src={logo} alt="JCBL Logo" />
</Link>        </div>

        {/* NAV */}
        <nav className={`nav ${sidebarOpen ? "open" : ""}`}>
          <div className="mobile-header">
  <button className="close-btn" onClick={() => setSidebarOpen(false)}>
    <HiX size={24} />
  </button>
</div>
          {loading ? (
            <>
              <div className="skeleton-menu-item"></div>
              <div className="skeleton-menu-item"></div>
              <div className="skeleton-menu-item"></div>
            </>
          ) : (
            Array.isArray(menu) && menu.length > 0 ? (
menu
  .filter((item) => {
  
    return !item.url.includes("/category/");
  })
  .map((item, index) => {
                const path = item.url === "/" ? "/" : item.url.replace("#", "");

                // 🔥 PRODUCTS MEGA MENU
                if (item.label && item.label.toLowerCase().includes("product")) {
                  return (
                    <div className={`dropdown mega ${openMenu ? "active" : ""}`} key={index}>

<span
  className="nav-link"
  onClick={(e) => {
    e.stopPropagation();

    // MOBILE: toggle accordion
    if (window.innerWidth < 992) {
      setOpenMenu(prev => !prev);
    } else {
      toggleMegaMenu(e);
    }
  }}
>                        {item.label}
                      </span>

                      <div className="mega-menu">
{window.innerWidth < 992 && openMenu && (
  <div className="mobile-categories">

    {categories
      .filter(cat => cat.slug !== "uncategorized")
      .map(parent => (

      <div key={parent.id}>

        {/* PARENT */}
        <div className="parent-item">

          {/* TITLE */}
          <Link
            to={`/category/${parent.slug}`}
            className="parent-link"
            onClick={() => setSidebarOpen(false)}
          >
            {parent.name}
          </Link>

          {/* ARROW */}
          {parent.children?.length > 0 && (
            <span
              className="arrow-toggle"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCat(prev => prev === parent.id ? null : parent.id);
              }}
            >
              <HiChevronRight />
            </span>
          )}
        </div>

        {/* CHILD */}
        {activeCat === parent.id && (
          <div className="mobile-submenu">

            {parent.children.map(child => (
              <div key={child.id}>

                <div className="child-item">

                  <Link
                    to={`/category/${child.slug}`}
                    className="child-link"
                    onClick={() => setSidebarOpen(false)}
                  >
                    {child.name}
                  </Link>

                  {child.children?.length > 0 && (
                    <span
                      className="arrow-toggle"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveChild(prev =>
                          prev === child.id ? null : child.id
                        );
                      }}
                    >
                      <HiChevronRight />
                    </span>
                  )}

                </div>

                {/* GRAND CHILD */}
                {activeChild === child.id && (
                  <div className="mobile-submenu">
                    {child.children.map(grand => (
                      <Link
                        key={grand.id}
                        to={`/category/${grand.slug}`}
                        className="grand-child"
                        onClick={() => setSidebarOpen(false)}
                      >
                        {grand.name}
                      </Link>
                    ))}
                  </div>
                )}

              </div>
            ))}

          </div>
        )}

      </div>
    ))}

  </div>
)}
                        {/* LEFT: PARENT */}
                        <div className="mega-left">
                          {Array.isArray(categories) && categories
  .filter(cat => cat.slug !== "uncategorized") // ✅ REMOVE IT
  .map((parent) => (
                         <Link
  key={parent.id}
  to={`/category/${parent.slug}`}
  className={`parent-item ${activeCat === parent.id ? "active" : ""}`}
  onMouseEnter={() => setActiveCat(parent.id)}
  onClick={() => setOpenMenu(false)}
>
<span className="menu-item">
  {parent.name}
  {parent.children?.length > 0 && (
    <HiChevronRight className="arrow-icon" />
  )}
</span>
</Link>
                          ))}
                        </div>

                        {/* RIGHT */}
                        <div className="mega-right">

                          {/* CHILD COLUMN */}
                          <div className="child-column">
                            {categories.map((parent) => {
                              if (parent.id !== activeCat) return null;

                              return parent.children?.map((child) => (
 <Link
  key={child.id}
  to={`/category/${child.slug}`}
  className={`child-item ${activeChild === child.id ? "active" : ""}`}
  onMouseEnter={() => setActiveChild(child.id)}
  onClick={() => setOpenMenu(false)}
>
  <span className="menu-item">
  {child.name}
  {child.children?.length > 0 && (
    <HiChevronRight className="arrow-icon" />
  )}
</span>
</Link>
                              ));
                            })}
                          </div>

                          {/* GRANDCHILD COLUMN */}
                          <div className="grand-column">
                            {categories.map((parent) => {
                              if (parent.id !== activeCat) return null;

                              return parent.children?.map((child) => {
                                if (child.id !== activeChild) return null;

                                return child.children?.map((grand) => (
                              <Link
  to={`/category/${grand.slug}`}
  onClick={() => setOpenMenu(false)}
>
  {grand.name}
</Link>
                                ));
                              });
                            })}
                          </div>

                        </div>

                      </div>
                    </div>
                  );
                }

                // NORMAL MENU
                return (
                  <Link key={index} to={path}>
                    {item.label}
                  </Link>
                );
              })
            ) : (
              <p>No menu found</p>
            )
          )}
        </nav>

        {/* RIGHT SIDE */}
        <div className="navbar-right">
          {loading ? (
            <>
              <div className="skeleton-button"></div>
              <div className="skeleton-lang"></div>
              <div className="skeleton-hamburger"></div>
            </>
          ) : (
            <>
              <button className="btn btn-blue">
                <span>Contact Us</span>
              </button>
<select
  className="lang"
  onChange={(e) => {
    const lang = e.target.value;

    const googleSelect = document.querySelector(".goog-te-combo");

    if (googleSelect) {
      googleSelect.value = lang;
      googleSelect.dispatchEvent(new Event("change"));
    } else {
      console.log("Translator not loaded yet");
    }
  }}
>
  <option value="en">English</option>
  <option value="hi">Hindi</option>
  <option value="es">Spanish</option>
  <option value="fr">French</option>
  <option value="de">German</option>
  <option value="it">Italian</option>
  <option value="pt">Portuguese</option>
  <option value="ru">Russian</option>
  <option value="ar">Arabic</option>
  <option value="zh-CN">Chinese</option>
  <option value="ja">Japanese</option>
  <option value="ko">Korean</option>
</select>          

  <button className="hamburger" onClick={toggleSidebar}>
                <HiMenu size={24} />
              </button>
            </>
          )}
        </div>

      </div>
    </header>
    </>
  );
}

export default Header;