import { gql, useQuery } from '@apollo/client';
import Dishes from "./dishes"
import { useContext, useState } from 'react';


import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Container,
  Row,
  Col
} from "reactstrap";

function RestaurantList(props) {
  const [restaurantID, setRestaurantID] = useState(null)
  const { cart } = useContext(AppContext);
  const [state, setState] = useState(cart)
  const GET_RESTAURANTS = gql`
    query {
      restaurants {
        documentId
        name
        description
        image {
          url
        }
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_RESTAURANTS)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR</p>;
  if (!data) return <p>Not found</p>;
  console.log(`Query Data: ${data.restaurants}`)


  let searchQuery = data.restaurants.filter((res) => {
    return res.name.toLowerCase().includes(props.search)
  }) || [];

  let restId = searchQuery[0] ? searchQuery[0].documentId : null;
  console.log("restId to be passed to Dishes:", restId);

  // definet renderer for Dishes
  const renderDishes = (restaurantID) => {
    console.log("restaurantID being passed to Dishes:", restaurantID);
    return (<Dishes restId={restaurantID}/>)
  };
  if (searchQuery.length > 0) {
    const restList = searchQuery.map((res) => (
      <Col xs="6" sm="4" key={res.documentId}>
        <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
          <CardImg
            top={true}
            style={{ height: 200 }}
            src={
              res.image?.url?.startsWith('http')
                ? res.image.url // URL absoluta, úsala directamente
                : `https://precious-hero-3e40f663a6.strapiapp.com${res.image?.url || "/placeholder-image.jpg"}` // URL relativa o placeholder
            }
          />

          <CardBody>
            <CardText>{res.description}</CardText>
          </CardBody>
          <div className="card-footer">

            <Button color="info" onClick={() => {console.log("Settting restaurantID to:", res.documentId); setRestaurantID(res.documentId);}}>{res.name}</Button>

          </div>
        </Card>
      </Col>
    ))

    return (

      <Container>
        <Row xs='3'>
          {restList}
        </Row>

        <Row xs='3'>
          {restaurantID && <Dishes restId={restaurantID} />}
        </Row>

      </Container>

    )
  } else {
    return <h1> No Restaurants Found</h1>
  }
}
export default RestaurantList
