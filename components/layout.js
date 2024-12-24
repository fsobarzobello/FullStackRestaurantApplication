import React, { useContext } from "react";
import Head from "next/head";
import Link from "next/link";
import { Container, Nav, NavItem } from "reactstrap";
import AppContext from "./context";
import { logout } from "./auth"; // Asegúrate de que esté bien importado

const Layout = (props) => {
  const title = "Welcome to Nextjs";
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
        <Nav className="navbar navbar-dark bg-dark">
          <NavItem>
            <Link href="/" className="navbar-brand">
              Home
            </Link>
          </NavItem>
          <NavItem className="ml-auto">
            {user ? (
              <h5>{user.username}</h5>
            ) : (
              <Link href="/register" className="nav-link">
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
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            ) : (
              <Link href="/login" className="nav-link">
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
