import {useRouter} from "next/router"
import {gql,useQuery} from '@apollo/client';
import {useState, useContext} from 'react'
import AppContext from "./context"
import {
  Button,
  Card,
  CardBody,
  CardImg,
  CardText,
  CardTitle,
  Row,
  Col} from "reactstrap";
function Dishes({restId}){
  const [restaurantID, setRestaurantID] = useState()
  const {addItem} = useContext(AppContext)

const GET_RESTAURANT_DISHES = gql`
  query($documentId: ID!){
    restaurant(documentId: $documentId) {
      documentId
      name
      dishes {
          documentId
          name
          description
          price
          image {
            url
          }
      }
    }
  }
`;

  const router = useRouter();

  const { loading, error, data } = useQuery(GET_RESTAURANT_DISHES, {
    variables: { documentId: restId },
    skip: !restId, // Evita ejecutar la consulta si restId no está definido
  });
  
  console.log("restId passed to Dishes:", restId);
  console.log("Variables sent to GraphQL:", { documentId: restId });
  console.log("Loading status:", loading);
  console.log("Error:", error);
  console.log("Data received from GraphQL:", data);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>ERROR here</p>;
  if (!data) return <p>Not found</p>;

  let dishes = data.restaurant.dishes || [];

  if (dishes.length > 0){

    return (
      <>
          {dishes.map((dish) => (
            <Col xs="6" sm="4" style={{ padding: 0 }} key={dish.documentId}>
              <Card style={{ margin: "0 10px" }}>
                <CardImg
                  top={true}
                  style={{ height: 150, width:150 }}
                  src={`https://precious-hero-3e40f663a6.strapiapp.com${dish.image?.url || "/placeholder-image.jpg"}`}
                />
                <CardBody>
                  <CardTitle>{dish.name}</CardTitle>
                  <CardText>{dish.description}</CardText>
                </CardBody>
                <div className="card-footer">
                  <Button color="info"
                    outline
                    //color="primary"
                    onClick = {()=> addItem(dish)}
                  >
                    + Add To Cart
                  </Button>
                  
                </div>
              </Card>
            </Col>
          ))}
        </>
        )}
        else{
          return <h1> No Dishes</h1>
        }
    }
    export default Dishes
