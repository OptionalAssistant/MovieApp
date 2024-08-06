import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import ModalWindow from "./Login";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Context from "../context/context";

function Header() {
  const [modalShow, setModalShow] = React.useState<boolean>(false);
  const { state, dispatch } = useContext(Context);

  let button;

  if (state.data && state.loading === false) {
    button = (
      <Button
        variant="danger"
        onClick={() => {
          window.localStorage.removeItem("token");
          dispatch({ type: "set", payload: null });
        }}
      >
        Logout  
      </Button>
    );
  } else {
    button = (
      <Button
        variant="primary"
        type="button"
        onClick={() => setModalShow(true)}
      >
        Login
      </Button>
    );
  }

  return (
    <>
      <Row className="mt-4">
        <Col lg={3} className="mb-3 btn-md">
          <Link to="/">
            <Button variant="primary">Home</Button>
          </Link>
        </Col>
        <Col lg={3}>
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success btn btn-primary btn-md">
              Search
            </Button>
          </Form>
        </Col>
        <Col lg={3}>{button}</Col>
      </Row>

      <ModalWindow show={modalShow} hide={() => setModalShow(false)} />
    </>
  );
}

export default Header;
