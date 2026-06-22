"use client"; 
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { HiMenu, HiX, HiChevronRight, HiPhone, HiMail } from "react-icons/hi";
import "./Header.css";
import logo from "../assets/images/JCBL-logo-header.png";
import SearchBar from "./SearchBar";
import Image from "next/image";

function Header() {
  // Add this missing state declaration
  const [activeChild, setActiveChild] = useState(null);
  const [mobileParentOpen, setMobileParentOpen] = useState(null);
  const [mobileChildOpen, setMobileChildOpen] = useState(null);
  const [activeCat, setActiveCat] = useState("car-spare-parts");
  
  useEffect(() => {
    const activeParent = parentCategories.find(
      (p) => p.id === activeCat
    );

    if (!activeParent) return;

    const children = getChildrenForParent(
      activeParent.id,
      activeParent.name
    );

    if (children.length > 0) {
      setActiveChild(children[0].id);
    }
  }, [activeCat]);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const hoverTimeout = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize(); // set initial value

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Handle click outside for mobile
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isMobile) return;
      const isInsideMenu = e.target.closest(".dropdown.mega");
      if (!isInsideMenu && openMenu) {
        setOpenMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [isMobile, openMenu]);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // STATIC PARENT CATEGORIES (from your first image)
  const parentCategories = [
    { id: "car-spare-parts", name: "Car Spare Parts", slug: "car-spare-parts" },
    { id: "chrome-parts", name: "Chrome Parts", slug: "chrome-parts" },
    { id: "motorcycle-spare-parts", name: "Motorcycle Spare Parts", slug: "motorcycle-spare-parts" },
    { id: "helmets", name: "Helmets", slug: "helmets" },
    { id: "heavy-machinery-parts", name: "Heavy Machinery Parts", slug: "heavy-machinery-parts" },
    { id: "tractor-parts", name: "Tractor Parts", slug: "tractor-part" },
    { id: "lubricants", name: "Lubricants", slug: "lubricants" },
    { id: "batteries", name: "Batteries", slug: "batteries" },
    { id: "alloy-wheels", name: "Alloy Wheels", slug: "alloy-wheels" }
  ];

  // STATIC CHILD CATEGORIES (Car Brands)
  const carBrands = [
    { id: "hyundai", name: "Hyundai", slug: "hyundai", parentId: "car-spare-parts" },
    { id: "maruti-suzuki", name: "Maruti Suzuki", slug: "maruti-suzuki", parentId: "car-spare-parts" },
    { id: "mahindra", name: "Mahindra", slug: "mahindra", parentId: "car-spare-parts" },
    { id: "tata", name: "Tata", slug: "tata", parentId: "car-spare-parts" },
    { id: "chevrolet", name: "Chevrolet", slug: "chevrolet", parentId: "car-spare-parts" },
    { id: "renault", name: "Renault", slug: "renault", parentId: "car-spare-parts" },
    { id: "honda", name: "Honda", slug: "honda", parentId: "car-spare-parts" },
    { id: "nissan", name: "Nissan", slug: "nissan", parentId: "car-spare-parts" }
  ];

  // Heavy Machinery subcategories
  const heavyMachinerySubs = [
    { id: "heavy-machinery-pin-bushes", name: "Heavy Machinery Pin & Bushes", slug: "heavy-machinery-pin-bushes" },
    { id: "heavy-machinery-misc-parts", name: "Heavy Machinery Misc. Parts", slug: "heavy-machinery-misc-parts" },
    { id: "heavy-machinery-linkage-parts", name: "Heavy Machinery Linkage Parts", slug: "heavy-machinery-linkage-parts" }
  ];

  // STATIC GRANDCHILDREN (Car Models) - Updated with ALL models from images
  const carModels = {
    hyundai: [
      "Accent", 
      "Elantra Fluidic", 
      "Elantra", 
      "Eon", 
      "Grand i10", 
      "i20 Elite", 
      "Santro", 
      "Verna Fluidic", 
      "Creta", 
      "i10", 
      "i20", 
      "Santro Xing", 
      "Venue"
    ],
    "maruti-suzuki": [
      "Alto", 
      "Alto K10", 
      "Alto 800", 
      "Baleno", 
      "Brezza", 
      "Celerio", 
      "Ciaz", 
      "Dzire", 
      "Ertiga", 
      "Swift", 
      "Swift Dzire", 
      "Wagon R", 
      "Zen", 
      "Zen Estilo"
    ],
    mahindra: [
      "TUV300", 
      "XUV500", 
      "Xylo", 
      "Bolero", 
      "KUV100", 
      "XUV300", 
      "Scorpio"
    ],
  tata: [
  "Bolt",
  "Indica",
  "Indica Vista",
  "Indigo",
  "Nano",
  "Nexon",
  "Safari",
  "Sumo",
  "Tiago",
  "Tigor",
  "Zest"
],
    chevrolet: ["Beat"],
    renault: ["Kwid", "Triber", "Kiger", "Duster"],
    honda: ["Civic", "Honda City", "Amaze", "Honda Jazz"],
    nissan: ["Magnite", "Sunny", "Micra"]
  };

  // Battery subcategories (for Batteries parent)
  const batterySubs = [
    {
      id: "lithium-ion",
      name: "Lithium Ion Battery",
      externalUrl: "https://jcblbatteries.com/category/lithium-ion-batteries/",
    },
    {
      id: "automotive",
      name: "Automotive Battery",
      externalUrl: "https://jcblbatteries.com/category/auto-starting-series/",
    },
    {
      id: "motorcycle",
      name: "Motorcycle Battery",
      externalUrl: "https://jcblbatteries.com/category/motorcycle-starting-series/",
    },
    {
      id: "backup",
      name: "Backup Application Batteries",
      externalUrl: "https://jcblbatteries.com/category/backup-applications/",
    },
  ];

  // Get children for a parent category
  const getChildrenForParent = (parentId, parentName) => {
    if (parentName === "Car Spare Parts") {
      return carBrands;
    }
    if (parentName === "Batteries") {
      return batterySubs;
    }
    if (parentName === "Heavy Machinery Parts") {
      return heavyMachinerySubs;
    }
    return [];
  };

  // Check if a child has grandchildren
  const hasGrandChildren = (parentName, childId) => {
    if (parentName === "Car Spare Parts") {
      return carModels[childId]?.length > 0;
    }
    return false;
  };

  const getGrandChildren = (parentName, childId) => {
    if (parentName === "Car Spare Parts") {
      const models = carModels[childId] || [];
      return models.map(model => ({
        id: `${childId}-${model.toLowerCase().replace(/\s+/g, '-')}`,
        name: model,
        slug: model.toLowerCase().replace(/\s+/g, '-')
      }));
    }
    return [];
  };

  // Static menu items (from your WordPress menu)
  const menuItems = [
    { label: "Home", url: "/" },
    { label: "About Us", url: "/about-jcbl-group/" },
    { label: "Products", url: "/shop/", isProduct: true },
    { label: "Blog", url: "/blog/" },
    { label: "News & Events", url: "/news-events/" }
  ];

  return (
    <>
      {/* TOP BAR */}
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
            <Link href="/">
              <Image
                src={logo}
                alt="JCBL Logo"
                width={80}
                height={80}
                priority
              />            
            </Link>
          </div>

          {/* NAVIGATION */}
          <nav className={`nav ${sidebarOpen ? "open" : ""}`}>
            <div className="mobile-header">
              <button className="close-btn" onClick={() => setSidebarOpen(false)}>
                <HiX size={24} />
              </button>
            </div>

            {menuItems.map((item, index) => {
              if (item.isProduct) {
                return (
                  <div
                    className={`dropdown mega ${openMenu ? "active" : ""}`}
                    key={index}
                    onMouseEnter={() => {
                      if (!isMobile) {
                        clearTimeout(hoverTimeout.current);
                        setOpenMenu(true);
                      }
                    }}
                    onMouseLeave={() => {
                      if (!isMobile) {
                        hoverTimeout.current = setTimeout(() => {
                          setOpenMenu(false);
                        }, 300);
                      }
                    }}
                  >
                    <span
                      className="nav-link"
                      onClick={() => {
                        if (isMobile) {
                          setOpenMenu(!openMenu);
                        }
                      }}
                    >
                      {item.label}
                    </span>

                    {openMenu && (
                      <div className="mega-menu">
                        {/* DESKTOP VIEW */}
                        {!isMobile && (
                          <>
                            {/* LEFT PANEL - Parent Categories */}
                            <div className="mega-left">
                              {parentCategories.map((parent) => (
                                <Link
                                  key={parent.id}
                                  href={`/category/${parent.slug}`}
                                  className={`parent-item ${activeCat === parent.id ? "active" : ""}`}
                                  onMouseEnter={() => {
                                    setActiveCat(parent.id);
                                    const children = getChildrenForParent(
                                      parent.id,
                                      parent.name
                                    );
                                    if (children.length > 0) {
                                      setActiveChild(children[0].id);
                                    } else {
                                      setActiveChild(null);
                                    }
                                  }}
                                  onClick={() => setOpenMenu(false)}
                                >
                                  <span className="menu-item">
                                    {parent.name}
                                    {getChildrenForParent(parent.id, parent.name).length > 0 && (
                                      <HiChevronRight className="arrow-icon" />
                                    )}
                                  </span>
                                </Link>
                              ))}
                            </div>

                            {/* RIGHT PANEL - Children & Grandchildren */}
                            <div className="mega-right">
                              {/* Children Column */}
                              <div className="child-column">
                                {parentCategories.map((parent) => {
                                  if (parent.id !== activeCat) return null;
                                  const children = getChildrenForParent(parent.id, parent.name);
                                  return children.map((child) => (
                                    <Link
                                      key={child.id}
                                      href={
                                        child.externalUrl
                                          ? child.externalUrl
                                          : `/category/${child.slug}`
                                      }
                                      className={`child-item ${activeChild === child.id ? "active" : ""}`}
                                      onMouseEnter={() => {
                                        setActiveChild(child.id);
                                      }}
                                    >
                                      <span className="menu-item">
                                        {child.name}
                                        {hasGrandChildren(parent.name, child.id) && (
                                          <HiChevronRight className="arrow-icon" />
                                        )}
                                      </span>
                                    </Link>
                                  ));
                                })}
                              </div>

                              {/* Grandchildren Column */}
                              <div className="grand-column">
                                {parentCategories.map((parent) => {
                                  if (parent.id !== activeCat) return null;

                                  const children = getChildrenForParent(
                                    parent.id,
                                    parent.name
                                  );

                                  const currentChild = children.find(
                                    (c) => c.id === activeChild
                                  );

                                  if (!currentChild) {
                                    return (
                                      <div
                                        key="empty"
                                        className="no-grandchildren"
                                      >
                                        <p className="coming-soon">
                                          Select a category
                                        </p>
                                      </div>
                                    );
                                  }

                                  const grandchildren = getGrandChildren(
                                    parent.name,
                                    currentChild.id
                                  );

                                  if (!grandchildren.length) {
                                    return (
                                      <div
                                        key="no-data"
                                        className="no-grandchildren"
                                      >
                                        <p className="coming-soon">
                                          Coming Soon...
                                        </p>
                                      </div>
                                    );
                                  }

                                  return grandchildren.map((grand) => (
                                    <Link
                                      key={grand.id}
                                      href={`/category/${grand.slug}`}
                                      className="grandchild-link"
                                      onClick={() => setOpenMenu(false)}
                                    >
                                      {grand.name}
                                    </Link>
                                  ));
                                })}
                              </div>
                            </div>
                          </>
                        )}

                        {/* MOBILE VIEW */}
                        {isMobile && (
                          <div className="mobile-categories">
                            {parentCategories.map((parent) => {
                              const children = getChildrenForParent(parent.id, parent.name);

                              return (
                                <div key={parent.id} className="mobile-parent">
                                  <div className="mobile-parent-header">
                                    <Link
                                      href={`/category/${parent.slug}`}
                                      className="parent-link"
                                      onClick={() => {
                                        setSidebarOpen(false);
                                        setOpenMenu(false);
                                      }}
                                    >
                                      {parent.name}
                                    </Link>

                                    {children.length > 0 && (
                                      <button
                                        type="button"
                                        className="toggle-btn"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          setMobileParentOpen(
                                            mobileParentOpen === parent.id ? null : parent.id
                                          );
                                        }}
                                      >
                                        {mobileParentOpen === parent.id ? "-" : "+"}
                                      </button>
                                    )}
                                  </div>

                                  {mobileParentOpen === parent.id && (
                                    <div className="mobile-children">
                                      {children.map((child) => {
                                        const grandchildren = getGrandChildren(
                                          parent.name,
                                          child.id
                                        );

                                        return (
                                          <div key={child.id}>
                                            <div className="mobile-child-header">
                                              <Link
                                                href={
                                                  child.externalUrl
                                                    ? child.externalUrl
                                                    : `/category/${child.slug}`
                                                }
                                                className="child-link"
                                                onClick={() => {
                                                  setSidebarOpen(false);
                                                  setOpenMenu(false);
                                                }}
                                              >
                                                {child.name}
                                              </Link>

                                              {grandchildren.length > 0 && (
                                                <button
                                                  type="button"
                                                  className="toggle-btn"
                                                  onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setMobileChildOpen(
                                                      mobileChildOpen === child.id ? null : child.id
                                                    );
                                                  }}
                                                >
                                                  {mobileChildOpen === child.id ? "-" : "+"}
                                                </button>
                                              )}
                                            </div>

                                            {mobileChildOpen === child.id &&
                                              grandchildren.length > 0 && (
                                                <div className="mobile-grandchildren">
                                                  {grandchildren.map((grand) => (
                                                    <Link
                                                      key={grand.id}
                                                      href={`/category/${grand.slug}`}
                                                      className="grandchild-link"
                                                      onClick={() => {
                                                        setSidebarOpen(false);
                                                        setOpenMenu(false);
                                                      }}
                                                    >
                                                      {grand.name}
                                                    </Link>
                                                  ))}
                                                </div>
                                              )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              }
              
              return (
                <Link key={index} href={item.url}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="navbar-right">
            <div className="header-search">
              <SearchBar />
            </div>
            <Link href="/contact" className="btn btn-blue">
              Contact Us
            </Link>
            <select
              className="lang"
              defaultValue="en"
              onChange={(e) => {
                const lang = e.target.value;
                const googleSelect = document.querySelector(".goog-te-combo");
                if (googleSelect) {
                  googleSelect.value = lang;
                  googleSelect.dispatchEvent(new Event("change"));
                }
              }}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
            </select>
            <button className="hamburger" onClick={toggleSidebar}>
              <HiMenu size={24} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;