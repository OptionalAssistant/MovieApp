import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import ModalWindow from "./Login";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import Context from "../context/context";
import Alert from "react-bootstrap/esm/Alert";
import axios from "../axios";

function  Header() {
  const [modalShow, setModalShow] = React.useState<boolean>(false);
  const { state, dispatch } = useContext(Context);
  
  let button;

  const verifyEmail = async () => {
    axios
      .post("/activate")
      .then((data) => {
        console.log(data.data);
        alert(
          `Check email. Message sending to email: ${state.user}`
        );
      })
      .catch((err) => {
        console.log(err);
        alert(
          `Ooops. Message dont sending to email: ${state.user}`
        );
      });
  };
  if (state.user && state.loading === false) {
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
  if (state.user) console.log("Just someloggiin", state.user);
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
      {state.user && !state.user.isActivated && (
        <Alert variant="danger">
          <Alert.Heading>Ooops your email is not verified</Alert.Heading>
          <p>Verify your email click on the burron below</p>
          <Button variant="danger" onClick={verifyEmail}>
            Verify email
          </Button>
        </Alert>
      )}

      <ModalWindow show={modalShow} hide={() => setModalShow(false)} />
    </>
  );
}

export default Header;
