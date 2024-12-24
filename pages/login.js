/* /pages/login.js */

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import { login } from "../components/auth";
import AppContext from "../components/context";

function Login(props) {
  const [data, updateData] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [loggedIn, setLoggedIn] = useState(false); // Estado para controlar el cuadro de éxito
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/"); // redirect if you're already logged in
    }
  }, []);

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!data.identifier) {
      newErrors.identifier = "El correo electrónico es obligatorio.";
    } else if (!validateEmail(data.identifier)) {
      newErrors.identifier = "El correo electrónico no es válido.";
    }

    if (!data.password) {
      newErrors.password = "La contraseña es obligatoria.";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0; // Devuelve true si no hay errores
  };

  const onSubmit = () => {
    if (!validateForm()) return;

    setLoading(true);
    login(data.identifier, data.password)
      .then((res) => {
        setLoading(false);
        setLoggedIn(true); // Muestra el cuadro de éxito
        appContext.setUser(res.data.user);
        setTimeout(() => {
          router.push("/"); // Redirigir después de un tiempo
        }, 3000);
      })
      .catch((err) => {
        setLoading(false);
        setError({
          global: "El correo electrónico o la contraseña son incorrectos.",
        });
      });
  };

  function onChange(event) {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="header">
              <h2 style={{ color: "white", padding: "30px 50px" }}>
                {loggedIn ? "Success" : "Sign in"}
              </h2>
            </div>
            <section className="wrapper">
              {loggedIn ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "200px",
                    fontSize: "1.5em",
                    fontWeight: "bold",
                    color: "green",
                  }}
                >
                  ¡Inicio de sesión exitoso!
                </div>
              ) : (
                <>
                  {error.global && (
                    <div style={{ marginBottom: 10, color: "red" }}>
                      {error.global}
                    </div>
                  )}
                  <Form>
                    <fieldset disabled={loading}>
                      <FormGroup>
                        <Label>Email:</Label>
                        <Input
                          onChange={(event) => onChange(event)}
                          name="identifier"
                          value={data.identifier}
                          style={{ height: 50, fontSize: "1.2em" }}
                        />
                        {error.identifier && (
                          <small style={{ color: "red" }}>
                            {error.identifier}
                          </small>
                        )}
                      </FormGroup>
                      <FormGroup style={{ marginBottom: 30 }}>
                        <Label>Password:</Label>
                        <Input
                          onChange={(event) => onChange(event)}
                          type="password"
                          name="password"
                          value={data.password}
                          style={{ height: 50, fontSize: "1.2em" }}
                        />
                        {error.password && (
                          <small style={{ color: "red" }}>
                            {error.password}
                          </small>
                        )}
                      </FormGroup>

                      <FormGroup>
                        <span>
                          <a href="">
                            <small>Forgot Password?</small>
                          </a>
                        </span>
                        <Button
                          style={{ float: "right", width: 120 }}
                          color="primary"
                          disabled={loading}
                          onClick={onSubmit}
                        >
                          {loading ? "Loading... " : "Submit"}
                        </Button>
                      </FormGroup>
                    </fieldset>
                  </Form>
                </>
              )}
            </section>
          </div>
        </Col>
      </Row>
      <style jsx>
        {`
          .paper {
            border: 1px solid lightgray;
            box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.2),
              0px 1px 1px 0px rgba(0, 0, 0, 0.14),
              0px 2px 1px -1px rgba(0, 0, 0, 0.12);
            border-radius: 6px;
            margin-top: 90px;
          }
          .notification {
            color: #ab003c;
          }
          .header {
            width: 100%;
            height: 120px;
            background-color: #2196f3;
            margin-bottom: 30px;
            border-radius-top: 6px;
          }
          .wrapper {
            padding: 10px 30px 20px 30px !important;
          }
          a {
            color: blue !important;
          }
        `}
      </style>
    </Container>
  );
}

export default Login;
