import Offcanvas from "react-bootstrap/esm/Offcanvas";
import { useState } from "react";
import Button from "react-bootstrap/esm/Button";
import Row from "react-bootstrap/esm/Row";
import { useNavigate } from "react-router-dom";
import Dropdown from "react-bootstrap/esm/Dropdown";
import { Form } from "react-bootstrap";

interface CanvasProps {
  name: string;
  [key: string]: any; // For the rest of the props
}

function Canvas({ name, ...props }: CanvasProps) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const navigate = useNavigate();

  return (
    <>
      <Button variant="outline-danger" onClick={handleShow} className="me-2">
        {name}
      </Button>
      <Offcanvas show={show} onHide={handleClose} {...props}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Panel</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            {" "}
            <Button
              variant="outline-dark"
              type="button"
              onClick={() => {
                navigate("/admin-panel/add");
                handleClose();
              }}
            >
              Add movies
            </Button>
          </Row>
          <Row className="mt-2">
            <Button
              variant="outline-dark"
              type="button"
              onClick={() => {
                navigate("/admin-panel/category/add");
                handleClose();
              }}
            >
              Add/Remove category
            </Button>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

export default Canvas;
