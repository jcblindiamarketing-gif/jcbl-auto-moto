"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  HiMenu,
  HiX,
  HiChevronRight,
  HiPhone,
  HiMail,
} from "react-icons/hi";

import "./Header.css";
import SearchBar from "./SearchBar";

/* =========================
   PARENT CATEGORIES
========================= */

const parentCategories = [
  {
    id: "car-spare-parts",
    name: "Car Spare Parts",
    slug: "car-spare-parts",
  },
  {
    id: "chrome-parts",
    name: "Chrome Parts",
    slug: "chrome-parts",
  },
  {
    id: "motorcycle-spare-parts",
    name: "Motorcycle Spare Parts",
    slug: "motorcycle-spare-parts",
  },
  {
    id: "helmets",
    name: "Helmet",
    slug: "helmets",
  },
  {
    id: "three-wheeler-spare-parts",
    name: "Three Wheeler Spare Parts",
    slug: "three-wheeler-spare-parts",
  },
  {
    id: "heavy-machinery-parts",
    name: "Heavy Machinery Parts",
    slug: "heavy-machinery-parts",
  },
  {
    id: "tractor-parts",
    name: "Tractor Parts",
    slug: "tractor-part",
  },
  {
    id: "lubricants",
    name: "Lubricants",
    slug: "lubricants-engine-oil",
  },
  {
    id: "batteries",
    name: "Batteries",
    slug: "batteries",
  },
];

/* =========================
   CAR BRANDS
========================= */

const carBrands = [
  {
    id: "hyundai",
    name: "Hyundai",
    slug: "hyundai",
    parentId: "car-spare-parts",
  },
  {
    id: "maruti-suzuki",
    name: "Maruti Suzuki",
    slug: "maruti-suzuki",
    parentId: "car-spare-parts",
  },
  {
    id: "mahindra",
    name: "Mahindra",
    slug: "mahindra",
    parentId: "car-spare-parts",
  },
  {
    id: "tata",
    name: "Tata",
    slug: "tata",
    parentId: "car-spare-parts",
  },
  {
    id: "chevrolet",
    name: "Chevrolet",
    slug: "chevrolet",
    parentId: "car-spare-parts",
  },
  {
    id: "renault",
    name: "Renault",
    slug: "renault",
    parentId: "car-spare-parts",
  },
  {
    id: "honda",
    name: "Honda",
    slug: "honda",
    parentId: "car-spare-parts",
  },
  {
    id: "nissan",
    name: "Nissan",
    slug: "nissan",
    parentId: "car-spare-parts",
  },
];

/* =========================
   MOTORCYCLE BRANDS
========================= */

const motorcycleBrands = [
  {
    id: "bajaj",
    name: "Bajaj",
    slug: "bajaj",
    parentId: "motorcycle-spare-parts",
  },
  {
    id: "hero",
    name: "Hero",
    slug: "hero",
    parentId: "motorcycle-spare-parts",
  },
  {
    id: "honda",
    name: "Honda",
    slug: "honda-motorcycle-spare-parts",
    parentId: "motorcycle-spare-parts",
  },
  {
    id: "tvs",
    name: "TVS",
    slug: "tvs",
    parentId: "motorcycle-spare-parts",
  },
  {
    id: "yamaha",
    name: "Yamaha",
    slug: "yamaha",
    parentId: "motorcycle-spare-parts",
  },
];

/* =========================
   HELMET SUBCATEGORIES
========================= */

const helmetCategories = [
  {
    id: "flip-up-helmets",
    name: "Flip Up Helmets",
    slug: "flip-up-helmets",
    parentId: "helmets",
  },
  {
    id: "full-face-helmets",
    name: "Full Face Helmets",
    slug: "full-face-helmets",
    parentId: "helmets",
  },
  {
    id: "kids-helmets",
    name: "Kids Helmets",
    slug: "kids-helmets",
    parentId: "helmets",
  },
  {
    id: "motocross-helmets",
    name: "Motocross Helmets",
    slug: "motocross-helmets",
    parentId: "helmets",
  },
  {
    id: "open-face-helmets",
    name: "Open Face Helmets",
    slug: "open-face-helmets",
    parentId: "helmets",
  },
];

/* =========================
   THREE WHEELER CATEGORIES
========================= */

const threeWheelerBrands = [
  {
    id: "bajaj-compact-4s",
    name: "BAJAJ COMPACT 4S",
    slug: "bajaj-compact-4s",
    parentId: "three-wheeler-spare-parts",
  },
  {
    id: "bajaj-maxima-re-250",
    name: "BAJAJ MAXIMA / RE 250",
    slug: "bajaj-maxima-re-250",
    parentId: "three-wheeler-spare-parts",
  },
  {
    id: "piaggio-ape-city-petrol",
    name: "PIAGGIO APE CITY PETROL",
    slug: "piaggio-ape-city-petrol",
    parentId: "three-wheeler-spare-parts",
  },
  {
    id: "tvs-king",
    name: "TVS KING",
    slug: "tvs-king",
    parentId: "three-wheeler-spare-parts",
  },
];

/* =========================
   CAR MODELS
========================= */

const carModels = {
  hyundai: [
    "Accent",
    "Elantra Fluidic",
    "Elantra",
    "Eon",
    "Grand i10",
    "i20 Elite",
    "Verna Fluidic",
    "Creta",
    "i10",
    "i20",
    "Santro Xing",
    "Santro",
    "Venue",
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
    "Zen Estilo",
  ],
  mahindra: [
    "TUV300",
    "XUV500",
    "Xylo",
    "Bolero",
    "KUV100",
    "XUV300",
    "Scorpio",
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
    "Zest",
  ],
  chevrolet: ["Beat"],
  renault: ["Kwid", "Duster"],
  honda: ["Accord", "Civic", "Honda City", "Amaze", "Honda Jazz"],
  nissan: ["Magnite", "Sunny", "Micra"],
};

/* =========================
   MOTORCYCLE MODELS
========================= */

const motorcycleModels = {
  bajaj: [
    "Avenger Vibrant",
    "Boxer/KB4S",
    "Calibar",
    "CT-100",
    "Discover",
    "Platina",
    "Pulsar",
    "XCD",
  ],
  hero: [
    "CD DLX",
    "Glamour",
    "Hunk Achiever",
    "Karizma",
    "Passion",
    "Smart/Ambition",
    "Splendor",
  ],
  honda: [
    "CBZ/CB Trigger",
    "Dream Yuga",
    "Livo",
    "Shine",
    "Stunner",
    "Twister",
    "Unicorn",
  ],
  tvs: [
    "Apache",
    "Centra",
    "Fiero",
    "MAX-100/Phoenix",
    "Star City",
    "Victor",
  ],
  yamaha: [
    "Crux",
    "FZ",
    "Libero",
    "R15/Gladiator",
    "RX-100/Saluto",
    "SZR/Fazer",
  ],
};

/* =========================
   BATTERY CATEGORIES
========================= */

const batterySubs = [
  {
    id: "auto-starting",
    name: "Auto Starting Series",
    externalUrl:
      "https://jcblbatteries.com/category/auto-starting-series/",
  },
  {
    id: "motorcycle-starting",
    name: "Motorcycle Starting Series",
    externalUrl:
      "https://jcblbatteries.com/category/motorcycle-starting-series/",
  },
  {
    id: "backup-application",
    name: "Backup Application Batteries",
    externalUrl:
      "https://jcblbatteries.com/category/backup-applications/",
  },
  {
    id: "lithium-ion",
    name: "Lithium-ion Batteries",
    externalUrl:
      "https://jcblbatteries.com/category/lithium-ion-batteries/",
  },
];

/* =========================
   BATTERY GRANDCHILDREN
========================= */

const batteryGrandChildren = {
  "auto-starting": [
    {
      name: "Low Maintenance Dry Charged",
      url:
        "https://jcblbatteries.com/category/auto-starting-series/low-maintenance-dry-charged/",
    },
    {
      name: "Sealed Maintenance Free Batteries",
      url:
        "https://jcblbatteries.com/category/auto-starting-series/sealed-maintenance-free-batteries/",
    },
    {
      name: "Start Stop Advance Series",
      url:
        "https://jcblbatteries.com/category/auto-starting-series/start-stop-advance-series/",
    },
    {
      name: "SMF BCI Series",
      url: "https://jcblbatteries.com/product/smf-bci-series/",
    },
  ],
  "motorcycle-starting": [
    {
      name: "Dry Charged",
      url:
        "https://jcblbatteries.com/product/dry-charged-with-acid-bottle/",
    },
    {
      name: "MF Series",
      url:
        "https://jcblbatteries.com/category/motorcycle-starting-series/mf-series/",
    },
    {
      name: "Gel Series",
      url:
        "https://jcblbatteries.com/category/motorcycle-starting-series/gel-series/",
    },
  ],
  "backup-application": [
    {
      name: "Solar / Inverter Tubular Batteries",
      url:
        "https://jcblbatteries.com/product/high-performance-flooded-lead-acid-tubular-solar-inverter-batteries/",
    },
    {
      name: "SMF VRLA Solar / Industrial Batteries",
      url:
        "https://jcblbatteries.com/product/smf-vrla-solar-industrial-batteries/",
    },
  ],
  "lithium-ion": [
    {
      name: "Residential Energy Storage",
      url:
        "https://jcblbatteries.com/category/lithium-ion-batteries/residential-energy-storage-systems/",
    },
    {
      name: "Replacement For VRLA AGM & Gel Batteries",
      url:
        "https://jcblbatteries.com/product/replacement-for-vrla-agm-gel-batteries/",
    },
    {
      name: "Start Stop Series",
      url:
        "https://jcblbatteries.com/category/auto-starting-series/start-stop-advance-series/",
    },
  ],
};

/* =========================
   HELPER FUNCTIONS
========================= */

const getChildrenForParent = (parentId) => {
  switch (parentId) {
    case "car-spare-parts":
      return carBrands;

    case "motorcycle-spare-parts":
      return motorcycleBrands;

    case "helmets":
      return helmetCategories;

    case "three-wheeler-spare-parts":
      return threeWheelerBrands;

    case "batteries":
      return batterySubs;

    default:
      return [];
  }
};

const slugify = (value) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[\/]+/g, "-")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

const getGrandChildren = (parentId, childId) => {
  if (parentId === "car-spare-parts") {
    return (carModels[childId] || []).map((model) => ({
      id: model,
      name: model,
      slug: slugify(model),
    }));
  }

  if (parentId === "motorcycle-spare-parts") {
    return (motorcycleModels[childId] || []).map((model) => ({
      id: model,
      name: model,
      slug: slugify(model),
    }));
  }

  if (parentId === "batteries") {
    return (batteryGrandChildren[childId] || []).map((item, index) => ({
      id: `${childId}-${index}`,
      name: item.name,
      externalUrl: item.url,
    }));
  }

  return [];
};

const hasGrandChildren = (parentId, childId) => {
  return getGrandChildren(parentId, childId).length > 0;
};

/* =========================
   HEADER COMPONENT
========================= */

function Header() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [activeCat, setActiveCat] = useState("car-spare-parts");
  const [activeChild, setActiveChild] = useState(null);
  const [mobileParentOpen, setMobileParentOpen] = useState(null);
  const [mobileChildOpen, setMobileChildOpen] = useState(null);

  const hoverTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const activeParent = parentCategories.find(
      (parent) => parent.id === activeCat
    );

    if (!activeParent) return;

    const children = getChildrenForParent(activeParent.id);

    setActiveChild(children.length > 0 ? children[0].id : null);
  }, [activeCat]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!isMobile) return;

      const clickedInsideMenu = event.target.closest(".dropdown.mega");

      if (!clickedInsideMenu) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isMobile]);

  const toggleSidebar = () => {
    setSidebarOpen((previous) => !previous);
  };

  const closeMenus = () => {
    setSidebarOpen(false);
    setOpenMenu(false);
  };

  const getChildUrl = (parent, child) => {
    if (child.externalUrl) {
      return child.externalUrl;
    }

    return `/category/${parent.slug}/${child.slug}`;
  };

  const menuItems = [
    {
      label: "Home",
      url: "/",
    },
    {
      label: "About Us",
      url: "/about-us/",
    },
    {
      label: "Products",
      url: "/category",
      isProduct: true,
    },
    {
      label: "Blog",
      url: "/blog/",
    },
    {
      label: "News & Events",
      url: "/news-events/",
    },
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
            <a
              href="mailto:Sales@jcblautomoto.com"
              className="contact-link"
            >
              <HiMail className="top-icon" />
              <span>Sales@jcblautomoto.com</span>
            </a>
          </div>
        </div>
      </div>

      {/* MAIN HEADER */}
      <header className="header">
        <div className="container header-wrapper">
          {/* LOGO */}
          <div className="logo">
            <Link href="/">
              <Image
                src="/images/JCBL-logo-header.png"
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
              <button
                type="button"
                className="close-btn"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close menu"
              >
                <HiX size={24} />
              </button>
            </div>

            {menuItems.map((item) => {
              if (!item.isProduct) {
                return (
                  <Link
                    key={item.label}
                    href={item.url}
                    onClick={closeMenus}
                  >
                    {item.label}
                  </Link>
                );
              }

              return (
                <div
                  key={item.label}
                  className={`dropdown mega ${
                    openMenu ? "active" : ""
                  }`}
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
                  {/* PRODUCTS NAV ITEM */}
                  {isMobile ? (
                    <div className="mobile-product-nav">
                      <Link
                        href="/category"
                        className="nav-link"
                        onClick={closeMenus}
                      >
                        Products
                      </Link>

                      <button
                        type="button"
                        className="toggle-btn"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          setOpenMenu((previous) => !previous);
                        }}
                      >
                        {openMenu ? "-" : "+"}
                      </button>
                    </div>
                  ) : (
                    <Link href="/category" className="nav-link">
                      Products
                    </Link>
                  )}

                  {openMenu && (
                    <div className="mega-menu">
                      {/* DESKTOP MEGA MENU */}
                      {!isMobile && (
                        <>
                          <div className="mega-left">
                            {parentCategories.map((parent) => {
                              const children = getChildrenForParent(
                                parent.id
                              );

                              return (
                                <Link
                                  key={parent.id}
                                  href={`/category/${parent.slug}`}
                                  className={`parent-item ${
                                    activeCat === parent.id
                                      ? "active"
                                      : ""
                                  }`}
                                  onMouseEnter={() => {
                                    setActiveCat(parent.id);
                                    setActiveChild(
                                      children.length > 0
                                        ? children[0].id
                                        : null
                                    );
                                  }}
                                  onClick={() => setOpenMenu(false)}
                                >
                                  <span className="menu-item">
                                    {parent.name}

                                    {children.length > 0 && (
                                      <HiChevronRight className="arrow-icon" />
                                    )}
                                  </span>
                                </Link>
                              );
                            })}
                          </div>

                          <div className="mega-right">
                            {/* CHILDREN */}
                            <div className="child-column">
                              {parentCategories.map((parent) => {
                                if (parent.id !== activeCat) {
                                  return null;
                                }

                                const children = getChildrenForParent(
                                  parent.id
                                );

                                return children.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={getChildUrl(parent, child)}
                                    className={`child-item ${
                                      activeChild === child.id
                                        ? "active"
                                        : ""
                                    }`}
                                    onMouseEnter={() =>
                                      setActiveChild(child.id)
                                    }
                                  >
                                    <span className="menu-item">
                                      {child.name}

                                      {hasGrandChildren(
                                        parent.id,
                                        child.id
                                      ) && (
                                        <HiChevronRight className="arrow-icon" />
                                      )}
                                    </span>
                                  </Link>
                                ));
                              })}
                            </div>

                            {/* GRANDCHILDREN */}
                            <div className="grand-column">
                              {parentCategories.map((parent) => {
                                if (parent.id !== activeCat) {
                                  return null;
                                }

                                const children = getChildrenForParent(
                                  parent.id
                                );

                                const currentChild = children.find(
                                  (child) => child.id === activeChild
                                );

                                if (!currentChild) {
                                  return null;
                                }

                                const grandchildren = getGrandChildren(
                                  parent.id,
                                  currentChild.id
                                );

                                return grandchildren.map((grand) => (
                                  <Link
                                    key={grand.id}
                                    href={
                                      grand.externalUrl
                                        ? grand.externalUrl
                                        : `/category/${parent.slug}/${currentChild.slug}/${grand.slug}`
                                    }
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

                      {/* MOBILE MENU */}
                      {isMobile && (
                        <div className="mobile-categories">
                          {parentCategories.map((parent) => {
                            const children = getChildrenForParent(
                              parent.id
                            );

                            const parentIsOpen =
                              mobileParentOpen === parent.id;

                            return (
                              <div
                                key={parent.id}
                                className="mobile-parent"
                              >
                                <div className="mobile-parent-header">
                                  <Link
                                    href={`/category/${parent.slug}`}
                                    className="parent-link"
                                    onClick={closeMenus}
                                  >
                                    {parent.name}
                                  </Link>

                                  {children.length > 0 && (
                                    <button
                                      type="button"
                                      className="toggle-btn"
                                      onClick={(event) => {
                                        event.preventDefault();
                                        event.stopPropagation();

                                        setMobileParentOpen(
                                          parentIsOpen
                                            ? null
                                            : parent.id
                                        );
                                      }}
                                    >
                                      {parentIsOpen ? "-" : "+"}
                                    </button>
                                  )}
                                </div>

                                {parentIsOpen && (
                                  <div className="mobile-children">
                                    {children.map((child) => {
                                      const grandchildren =
                                        getGrandChildren(
                                          parent.id,
                                          child.id
                                        );

                                      const childIsOpen =
                                        mobileChildOpen === child.id;

                                      return (
                                        <div key={child.id}>
                                          <div className="mobile-child-header">
                                            <Link
                                              href={getChildUrl(
                                                parent,
                                                child
                                              )}
                                              className="child-link"
                                              onClick={closeMenus}
                                            >
                                              {child.name}
                                            </Link>

                                            {grandchildren.length > 0 && (
                                              <button
                                                type="button"
                                                className="toggle-btn"
                                                onClick={(event) => {
                                                  event.preventDefault();
                                                  event.stopPropagation();

                                                  setMobileChildOpen(
                                                    childIsOpen
                                                      ? null
                                                      : child.id
                                                  );
                                                }}
                                              >
                                                {childIsOpen ? "-" : "+"}
                                              </button>
                                            )}
                                          </div>

                                          {childIsOpen &&
                                            grandchildren.length > 0 && (
                                              <div className="mobile-grandchildren">
                                                {grandchildren.map(
                                                  (grand) => (
                                                    <Link
                                                      key={grand.id}
                                                      href={
                                                        grand.externalUrl
                                                          ? grand.externalUrl
                                                          : `/category/${parent.slug}/${child.slug}/${grand.slug}`
                                                      }
                                                      className="grandchild-link"
                                                      onClick={closeMenus}
                                                    >
                                                      {grand.name}
                                                    </Link>
                                                  )
                                                )}
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
            })}
          </nav>

          {/* RIGHT SIDE */}
          <div className="navbar-right">
            <div className="header-search">
              <SearchBar />
            </div>

            <Link href="/contact-us" className="btn btn-blue">
              Contact Us
            </Link>

            <select
              className="lang"
              defaultValue="en"
              onChange={(event) => {
                const lang = event.target.value;
                const googleSelect =
                  document.querySelector(".goog-te-combo");

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

            <button
              type="button"
              className="hamburger"
              onClick={toggleSidebar}
              aria-label="Open menu"
            >
              <HiMenu size={24} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;