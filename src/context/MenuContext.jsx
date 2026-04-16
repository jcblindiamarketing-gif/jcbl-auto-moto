import { createContext, useEffect, useState } from "react";

export const MenuContext = createContext();

const API_URL = "https://www.jcblautomoto.com/graphql";

export const MenuProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL, {
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
    }
  }
}
`,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("GRAPHQL DATA 👉", res);

        setMenu(res?.data?.menu?.menuItems?.nodes || []);
        setCategories(res?.data?.productCategories?.nodes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("GraphQL Error:", err);
        setMenu([]);
        setCategories([]);
        setLoading(false);
      });
  }, []);

  return (
    <MenuContext.Provider value={{ menu, categories, loading }}>
      {children}
    </MenuContext.Provider>
  );
};