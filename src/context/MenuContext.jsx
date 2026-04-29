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

              productCategories(first: 100) {
                nodes {
                  id
                  name
                  slug
                  parent {
                    node {
                      id
                    }
                  }
                  image {
                    sourceUrl
                  }

                  children {
                    nodes {
                      id
                      name
                      slug
                      parent {
                        node {
                          id
                        }
                      }

                      children {
                        nodes {
                          id
                          name
                          slug
                          parent {
                            node {
                              id
                            }
                          }
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

        // ✅ RAW CATEGORIES
        const rawCategories = data?.data?.productCategories?.nodes || [];

        // ✅ FORMAT TREE
        const formatted = rawCategories.map((parent) => ({
          id: parent.id,
          name: parent.name,
          slug: parent.slug,
          parentId: parent.parent?.node?.id || null,
          image: parent.image?.sourceUrl || null,

          children:
            parent.children?.nodes?.map((child) => ({
              id: child.id,
              name: child.name,
              slug: child.slug,
              parentId: child.parent?.node?.id || parent.id,

              children:
                child.children?.nodes?.map((grand) => ({
                  id: grand.id,
                  name: grand.name,
                  slug: grand.slug,
                  parentId: grand.parent?.node?.id || child.id,
                })) || [],
            })) || [],
        }));

        // ✅ ONLY TOP-LEVEL (PARENTS)
        const parentCategories = formatted.filter(
          (cat) => cat.parentId === null && cat.slug !== "uncategorized"
        );

        setCategories(parentCategories);

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