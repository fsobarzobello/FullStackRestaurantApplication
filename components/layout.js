import React, { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Nav, NavItem } from "reactstrap";
import AppContext from "./context";
import { logout } from "./auth"; // Asegúrate de que esté bien importado

const Layout = (props) => {
  const title = "Delivery's";
  const { user, setUser } = useContext(AppContext);

  const handleLogout = () => {
    logout(); // Elimina las cookies y realiza otras tareas de cierre de sesión
    setUser(null); // Actualiza el contexto del usuario
  };

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <Nav
          className="navbar"
          style={{ backgroundColor: "#003b73", padding: "10px" }} // Navy Blue
        >
          <NavItem>
            <Link
              href="/"
              className="navbar-brand"
              style={{ color: "#d4f1f4" }} // Baby Blue
            >
              Delivery's Next Home
            </Link>
          </NavItem>
          <NavItem className="ml-auto">
            {user ? (
              <h5 style={{ color: "#75e6da" }}>{user.username}</h5> // Blue Green
            ) : (
              <Link href="/register" className="nav-link" style={{ color: "#bfd7ed" }}> 
                Sign up
              </Link>
            )}
          </NavItem>
          <NavItem>
            {user ? (
              <button
                className="nav-link"
                onClick={handleLogout}
                style={{
                  background: "none",
                  border: "none",
                  color: "#d4f1f4", // Baby Blue
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="nav-link" style={{ color: "#bfd7ed" }}>
                Sign in
              </Link>
            )}
          </NavItem>
        </Nav>
      </header>
      <Container>{props.children}</Container>
    </div>
  );
};

export default Layout;
