import { useContext } from "react";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";

import Movie from "../components/Movie";
import { PageParams } from "../types/typesClient";

import "../App.css";
import { useAppSelector } from "../redux/store";

function Page(props: PageParams) {
  const movies = useAppSelector((state) => state.movies.movies);
  const loading = useAppSelector((state) => state.movies.loading);
  return (
    <>
      <Row xs={1} md={3} className="g-4  mb-3 card-fixed">
        {movies &&
          !loading &&
          movies.map((data, idx) => (
            <Col key={idx} className="equal-height">
              <Movie movie={data} />
            </Col>
          ))}
      </Row>
      <Row>
        {" "}
        {!loading && props.items}
      </Row>
      <br />
    </>
  );
}

export default Page;
