import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { useNavigate } from "react-router-dom";

function ProfileNav() {
  const navigate = useNavigate();

  return (
    <Container style={{ maxWidth: "600px", marginLeft: 0 }}>
      {" "}
      {/* Set a maximum width */}
      <h1>Profile Configurations</h1>
      <Row>
        <Col>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => navigate("/profile")}
          >
            Main
          </Button>{" "}
        </Col>
        <Col>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => navigate("/profile/liked/1")}
          >
            Liked
          </Button>{" "}
        </Col>
        <Col>
          <Button
            variant="outline-secondary"
            className="w-100"
            onClick={() => navigate("/profile/disliked/1")}
          >
            Disliked
          </Button>{" "}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfileNav;
