import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookie from "js-cookie";
import Router from "next/router";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardText,
  ListGroup,
  ListGroupItem,
} from "reactstrap";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:1337";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const userCookie = Cookie.get("user");
        if (!userCookie || userCookie === "undefined") {
          Router.push("/login");
          return;
        }

        let user;
        try {
          user = JSON.parse(userCookie);
        } catch (parseError) {
          console.error("Error parsing user cookie:", parseError);
          Router.push("/login");
          return;
        }
        const username = user.username;

        if (!username) {
            console.warn("Username not found in user cookie. Redirecting to login.");
            Router.push("/login");
            return;
          }
          

        const response = await axios.get(`${API_URL}/api/orders/history/${username}`, {
          headers: {
            Authorization: `Bearer ${Cookie.get("token")}`,
          },
        });
        setOrders(response.data.data);
      } catch (err) {
        console.error("Error fetching order history:", err);
        setError(err.message || "An error occurred while fetching orders.");
      }
    };

    fetchOrderHistory();
  }, []);

  const groupDishesByRestaurant = (dishes) => {
    const grouped = {};
    dishes.forEach((dish) => {
      const restaurantName = dish.restaurant?.name || "Unknown Restaurant";
      if (!grouped[restaurantName]) {
        grouped[restaurantName] = [];
      }
      grouped[restaurantName].push(dish);
    });
    return grouped;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container style={{ marginTop: "20px", color: "var(--text-dark)" }}>
      <Row>
        <Col>
          <h2 style={{ textAlign: "center", color: "var(--nav-bg)" }}>Your Order History</h2>
          {orders.map((order) => {
            const dishesGrouped = groupDishesByRestaurant(order.dishes);

            return (
              <Card
                key={order.id}
                className="card"
                style={{ marginBottom: "20px", boxShadow: "0 4px 6px var(--card-shadow)" }}
              >
                <CardBody>
                  <CardTitle>
                    <h5 style={{ color: "var(--text-dark)" }}>Order #{order.id}</h5>
                  </CardTitle>
                  <CardText>
                    <strong>Total:</strong> ${order.amount}
                  </CardText>
                  <CardText>
                    <strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}
                  </CardText>
                  <CardText>
                    <strong>Address:</strong> {order.address}, {order.city}, {order.state}
                  </CardText>
                  <CardText>
                    <strong>Payment Method:</strong> {order.payment_method || "Not Specified"}
                  </CardText>
                  <ListGroup>
                    {Object.keys(dishesGrouped).map((restaurantName, index) => (
                      <div key={index} style={{ marginTop: "10px" }}>
                        <h6 style={{ color: "var(--button-primary)" }}>
                          <strong>Restaurant: {restaurantName}</strong>
                        </h6>
                        <strong>Dishes</strong>
                        {dishesGrouped[restaurantName].map((dish, idx) => (
                          <ListGroupItem
                            key={idx}
                            style={{
                              backgroundColor: "var(--background)",
                              color: "var(--text-dark)",
                              borderColor: "var(--nav-bg)",
                            }}
                          >
                            {dish.name} (x{dish.quantity}) - ${dish.price}
                          </ListGroupItem>
                        ))}
                      </div>
                    ))}
                  </ListGroup>
                </CardBody>
              </Card>
            );
          })}
        </Col>
      </Row>
    </Container>
  );
};

export default OrderHistory;
