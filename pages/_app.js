import { useState, useEffect } from "react";
import Head from "next/head";
import AppContext from "../components/context";
import Layout from "../components/layout";
import Cookie from "js-cookie";

function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = Cookie.get("token");
    const storedUser = Cookie.get("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        setUser(null);
        setCart({ items: [], total: 0 });
      }
    };

    window.addEventListener("storage", syncLogout);

    return () => {
      window.removeEventListener("storage", syncLogout);
    };
  }, []);

  // Define la función `addItem`
  const addItem = (item) => {
    const foundItem = cart.items.find((i) => i.documentId === item.documentId);
    if (foundItem) {
      const updatedCart = {
        items: cart.items.map((i) =>
          i.documentId === item.documentId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
        total: cart.total + item.price,
      };
      setCart(updatedCart);
    } else {
      const newItem = { ...item, quantity: 1 };
      const updatedCart = {
        items: [...cart.items, newItem],
        total: cart.total + item.price,
      };
      setCart(updatedCart);
    }
  };

  // Define la función `removeItem`
  const removeItem = (item) => {
    const foundItem = cart.items.find((i) => i.documentId === item.documentId);
    if (foundItem.quantity > 1) {
      const updatedCart = {
        items: cart.items.map((i) =>
          i.documentId === item.documentId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        ),
        total: cart.total - item.price,
      };
      setCart(updatedCart);
    } else {
      const updatedCart = {
        items: cart.items.filter((i) => i.documentId !== item.documentId),
        total: cart.total - item.price,
      };
      setCart(updatedCart);
    }
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        setCart,
        user,
        setUser,
      }}
    >
      <Head>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css"
          integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
          crossOrigin="anonymous"
        />
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
}

export default MyApp;

