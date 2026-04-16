import { createContext, useEffect, useState } from "react";

export const MenuContext = createContext();

const API_URL = "https://www.jcblautomoto.com/graphql";

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuData = async () => {
      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
            {
              menu(id: "main-menu", idType: SLUG) {
                menuItems {
                  nodes {
                    id
                    label
                    url
                  }
                }
              }

              productCategories(first: 50) {
                nodes {
                  id
                  name
                  slug
                  image {
                    sourceUrl
                  }

                  children {
                    nodes {
                      id
                      name
                      slug

                      children {
                        nodes {
                          id
                          name
                          slug
                        }
                      }
                    }
                  }
                }
              }
            }
            `,
          }),
        });

        if (!res.ok) throw new Error("API failed");

        const data = await res.json();

        console.log("GRAPHQL DATA 👉", data);

        // ✅ MENU
        setMenu(data?.data?.menu?.menuItems?.nodes || []);

        // ✅ FORMAT CATEGORIES (VERY IMPORTANT)
        const rawCategories = data?.data?.productCategories?.nodes || [];

        const formattedCategories = rawCategories.map((parent) => ({
          ...parent,
          children:
            parent.children?.nodes?.map((child) => ({
              ...child,
              children: child.children?.nodes || [],
            })) || [],
        }));

        setCategories(formattedCategories);

      } catch (err) {
        console.error("GraphQL Error:", err);
        setMenu([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuData();
  }, []);

  return (
    <MenuContext.Provider value={{ menu, categories, loading }}>
      {children}
    </MenuContext.Provider>
  );
};