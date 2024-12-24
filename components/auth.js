/* /lib/auth.js */

import { useEffect } from "react";
import Router from "next/router";
import Cookie from "js-cookie";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://precious-hero-3e40f663a6.strapiapp.com";
console.log("API_URL:", process.env.NEXT_PUBLIC_API_URL);


//register a new user
export const registerUser = (username, email, password) => {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/local/register`, { username, email, password })
      .then((res) => {
        Cookie.set("token", res.data.jwt);
        Cookie.set("user", JSON.stringify(res.data.user)); // Guarda los datos del usuario
        localStorage.setItem("successMessage", "Registro exitoso");
        resolve(res);
        setTimeout(() => {
          Router.push("/");
        }, 4000);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const login = (identifier, password) => {
  if (typeof window === "undefined") {
    return;
  }
  return new Promise((resolve, reject) => {
    axios
      .post(`${API_URL}/api/auth/local/`, { identifier, password })
      .then((res) => {
        Cookie.set("token", res.data.jwt);
        Cookie.set("user", JSON.stringify(res.data.user)); // Guarda los datos del usuario
        resolve(res);
        setTimeout(() => {
          Router.push("/");
        }, 4000);
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const logout = () => {
  Cookie.remove("token");
  Cookie.remove("user");
  delete window.__user;
  window.localStorage.setItem("logout", Date.now());
  Router.push("/");
};


//Higher Order Component to wrap our pages and logout simultaneously logged in tabs
// THIS IS NOT USED in the tutorial, only provided if you wanted to implement
export const withAuthSync = (Component) => {
  const Wrapper = (props) => {
    const syncLogout = (event) => {
      if (event.key === "logout") {
        Router.push("/login");
      }
    };

    useEffect(() => {
      window.addEventListener("storage", syncLogout);

      return () => {
        window.removeEventListener("storage", syncLogout);
        window.localStorage.removeItem("logout");
      };
    }, []);

    return <Component {...props} />;
  };

  // Preserva `getInitialProps` solo si está definido en el componente
  Wrapper.getInitialProps = async (ctx) => {
    if (typeof Component.getInitialProps === "function") {
      const componentProps = await Component.getInitialProps(ctx);
      return { ...componentProps };
    }
    return {};
  };

  return Wrapper;
};

