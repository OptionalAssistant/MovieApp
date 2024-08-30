import { useContext } from "react";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import Movie from "../components/Movie";
import { IMovieList } from "../types/typesClient";

import "../App.css";


function MovieList(props: IMovieList) {

  return (
    <>
      <Row xs={1} md={3} className="g-4  mb-3 card-fixed">
          {props.movies.map((data, idx) => (
            <Col key={idx} className="equal-height">
              <Movie movie={data} />
            </Col>
          ))}
      </Row>

    </>
  );
}

export default MovieList;
