import { useContext, useEffect, useState } from "react";
import Context from "../context/contextUser";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import IMovieStore from "../context/contextMovie";
import { PageParams } from "../types/typesClient";
import Movie from "../components/Movie";


import "../App.css";


function Page(props: PageParams) {
  const movieContext = useContext(IMovieStore);
  console.log(movieContext.state.movies);
  return (
    <>
      <Row xs={1} md={3} className="g-4  mb-3 card-fixed">
        {movieContext.state.movies &&
          !movieContext.state.loading &&
          movieContext.state.movies.map((data, idx) => (
            <Col key={idx} className="equal-height">
              <Movie movie={data} />
            </Col>
          ))}
      </Row>
      <Row>
        {" "}
        {!movieContext.state.loading && props.items}
      </Row>
      <br />
    </>
  );
}

export default Page;
