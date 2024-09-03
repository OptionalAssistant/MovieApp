
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import { IMovieList } from "../types/typesClient";
import Movie from "./Movie";

import "../App.css";


function MovieList(props: IMovieList) {

  console.log("Movies",props.movies);
  return (
    <>
      <Row  xs={1} sm={2} md={3} xl={4} className="g-4 mb-3">
          {props.movies.map((data, idx) => (
            <Col key={idx} >
              <Movie movie={data} />
            </Col>
          ))}
      </Row>

    </>
  );
}

export default MovieList;
