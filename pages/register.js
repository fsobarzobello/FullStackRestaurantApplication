import React, { useState, useContext } from "react";
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
import { registerUser } from "../components/auth";
import AppContext from "../components/context";

const Register = () => {
  const [data, setData] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const [registered, setRegistered] = useState(false);
  const appContext = useContext(AppContext);

  const validateForm = () => {
    const errors = [];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!data.username || data.username.length < 6) {
      errors.push("Username must be at least 6 characters long.");
    }
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push("Please enter a valid email address.");
    }
    if (!data.password || data.password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }

    if (errors.length > 0) {
      setError({ message: errors });
      return false;
    }
    setError({});
    return true;
  };

  return (
    <Container>
      <Row>
        <Col sm="12" md={{ size: 5, offset: 3 }}>
          <div className="paper">
            <div className="header">
              <h2 style={{ color: "white", padding: "30px 50px" }}>
                {registered ? "Success" : "Sign up"}
              </h2>
            </div>
            <section className="wrapper">
              {registered ? (
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
                  ¡Registro exitoso!
                </div>
              ) : (
                <>
                  {error?.message &&
                    error.message.map((errorItem, index) => (
                      <div key={index} style={{ marginBottom: 10 }}>
                        <small style={{ color: "red" }}>{errorItem}</small>
                      </div>
                    ))}
                  <Form>
                    <fieldset disabled={loading}>
                      <FormGroup>
                        <Label>Username:</Label>
                        <Input
                          disabled={loading}
                          onChange={(e) =>
                            setData({ ...data, username: e.target.value })
                          }
                          value={data.username}
                          type="text"
                          name="username"
                          style={{ height: 50, fontSize: "1.2em" }}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Email:</Label>
                        <Input
                          onChange={(e) =>
                            setData({ ...data, email: e.target.value })
                          }
                          value={data.email}
                          type="email"
                          name="email"
                          style={{ height: 50, fontSize: "1.2em" }}
                        />
                      </FormGroup>
                      <FormGroup style={{ marginBottom: 30 }}>
                        <Label>Password:</Label>
                        <Input
                          onChange={(e) =>
                            setData({ ...data, password: e.target.value })
                          }
                          value={data.password}
                          type="password"
                          name="password"
                          style={{ height: 50, fontSize: "1.2em" }}
                        />
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
                          onClick={() => {
                            if (validateForm()) {
                              setLoading(true);
                              registerUser(
                                data.username,
                                data.email,
                                data.password
                              )
                                .then((res) => {
                                  appContext.setUser(res.data.user);
                                  setLoading(false);
                                  setRegistered(true);
                                })
                                .catch((error) => {
                                  console.log(
                                    `error in register: ${error}`
                                  );
                                  setLoading(false);
                                  setError({
                                    message: [
                                      "Error registering user. Try again.",
                                    ],
                                  });
                                });
                            }
                          }}
                        >
                          {loading ? "Loading.." : "Submit"}
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
};
export default Register;
