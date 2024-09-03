import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteMovieMutation, useDeletePersonMutation, useFetchAuthMeQuery } from "../redux/query";
import { IPerson } from "../types/typesRest";

function Person({ person }: { person: IPerson }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const {data : user,isLoading,error} = useFetchAuthMeQuery();
  const [deletePerson] = useDeletePersonMutation();
  
  const onDelete = async () => {
    try {
      deletePerson(Number(person.id));
      alert("Movie sucessfully deleted");
    } catch (eror) {
      alert("ERROR");
    }
  };
  const onEdit = async () => {
    navigate(`/admin-panel/person/${person.id}/edit`);
  };
  return (
    <>

      <Card >
        <div></div>
        <Card.Link as={Link} to={`/persons/${person.id}`}>
          {" "}
          <Card.Img
            variant="top"
            src={`http://localhost:4444/uploads/${person.avatarUrl}`}
            height={250}
            width={156}
          />  
        </Card.Link>

        <Card.Body>
          <Card.Title className="mb-3" style={{color:"#E0E0E0"}}>{person.name}</Card.Title>
          <Row>
            {user && user.roles === "ADMIN" && user.isActivated && (
              <>
                <Col className="mr-3">
                  <Button
                 variant="dark button-outline btn btn-primary btn-md"
                    type="button"
                    className="mr-3"
                    onClick={onDelete}
                  >
                    Delete
                  </Button>
                </Col>
                <Col className="mr-3">
                  <Button
                 variant="dark button-outline btn btn-primary btn-md"
                    type="button"
                    className="mr-3"
                    onClick={onEdit}
                  >
                    Edit
                  </Button>
                </Col>
              </>
            )}
          </Row>
        </Card.Body>
      </Card>
    </>
  );
}

export default Person;
