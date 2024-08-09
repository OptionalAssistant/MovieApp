import { useContext, useEffect, useState } from "react";
import Context from "../context/contextUser";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import Row from "react-bootstrap/esm/Row";
import Button from "react-bootstrap/esm/Button";
import "../App.css";
import Pagination from "react-bootstrap/esm/Pagination";
import axios from "../axios";
import { IMovie, movieNumber } from "../types/typesRest";
import IMovieStore from "../context/contextMovie";
import { Link } from "react-router-dom";
import { PageParams } from "../types/typesClient";

function MainPage(props: PageParams) {
  const movieContext = useContext(IMovieStore);

  const [items, setItems] = useState<JSX.Element[]>([]);
  const [itemsAmount, setAmount] = useState<number>();

  useEffect(() => {
    const fetchData = async () => {
      movieContext.dispatch({ type: "pending", payload: null });
      try {
        const { data } = await axios.get<IMovie[]>(`/movies/pages/${props.id}`);
        movieContext.dispatch({ type: "fullfilled", payload: data });
      } catch (error) {
        movieContext.dispatch({ type: "rejected", payload: null });
        console.log("Error during fetch movies", error);
      }
    };

    fetchData();
  }, [props.id]);
  useEffect(() => {}, [props.id]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        let size;
        size = await axios.get<movieNumber>("/movies/number");

        size = size.data.length;
        size = size / 9 + 1;
        const paginationItems: JSX.Element[] = [];

        paginationItems.push(
          <Pagination.Item key={1} as={Link} to={`/`} active={props.id === 1}>
            1
          </Pagination.Item>
        );

        for (let i = 2; i <= size; i++) {
          paginationItems.push(
            <Pagination.Item
              key={i}
              as={Link}
              to={`/pages/${i}`}
              active={props.id === i}
            >
              {i}
            </Pagination.Item>
          );
        }

        setItems(paginationItems);
      } catch (error) {
        console.log("Error during fetch movies", error);
      }
    };

    fetchData();
  }, [props.id]);

  console.log(items);
  return (
    <>
      <Row xs={1} md={3} className="g-4  mb-3 card-fixed">
        {movieContext.state.movies &&
          !movieContext.state.loading &&
          movieContext.state.movies.map((data, idx) => (
            <Col key={idx}>
              <Card className="card-fixed">
                <div></div>
                <Card.Link as={Link} to={`/movies/${data._id}`}>
                  {" "}
                  <Card.Img
                    variant="top"
                    src={`http://localhost:4444${data.imageUrl}`}
                
                  />
                </Card.Link>

                <Card.Body>
                  <Card.Title className="mb-3">{data.name}</Card.Title>
                  <Card.Subtitle className="mb-3">
                    {data.date}, {data.country}
                  </Card.Subtitle>
                  <Card.Link as={Link} to={`/movies/${data._id}`}>
                    <Button variant="primary" type="button">Watch</Button>
                  </Card.Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
      <br />
      <Row>
        <Pagination>
          <Pagination.First />
          <Pagination.Prev />
          {items}
          <Pagination.Ellipsis />
          <Pagination.Next />
          <Pagination.Last />
        </Pagination>
      </Row>
    </>
  );
}

export default MainPage;
