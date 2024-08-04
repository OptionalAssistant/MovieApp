import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import ModalWindow from "./Login";
import React from "react";

function Header() {
  const [modalShow, setModalShow] = React.useState<boolean>(false);
  return (
    <>
      <Row className="mt-4">
        <Col lg={3} className="mb-3 btn-md">
          <Button
            variant="primary"
            type="submit"
            onClick={() => setModalShow(true)}
          >
            Войти
          </Button>
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
      </Row>
      <ModalWindow show={modalShow} hide={() => setModalShow(false)} />
    </>
  );
}

export default Header;
