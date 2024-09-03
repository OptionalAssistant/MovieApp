import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/esm/Card";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDeleteMovieMutation, useFetchAuthMeQuery } from "../redux/query";
import { IMovie } from "../types/typesRest";

function Movie({ movie }: { movie: IMovie }) {

  const { id } = useParams();
  const navigate = useNavigate();

  const {data : user,isLoading,error} = useFetchAuthMeQuery();
  const [deleteMovie] = useDeleteMovieMutation();
  
  const onDelete = async () => {
    try {
      deleteMovie(Number(movie.id));
      alert("Movie sucessfully deleted");
    } catch (eror) {
      alert("ERROR");
    }
  };
  const onEdit = async () => {
    navigate(`/admin-panel/add/${movie.id}/edit`);
  };
  return (
    <>
      <Card className="card">
        <Card.Link as={Link} to={`/movies/${movie.id}`}>
          {" "}
          <Card.Img
            variant="top"
            src={`http://localhost:4444/uploads/${movie.imageUrl}`}
            height={250}
            width={156}
             className="movie-image"
          />  
        </Card.Link>

        <Card.Body >
          <Card.Title className="mb-3" style={{color:"#E0E0E0"}}>{movie.name}</Card.Title>
          <Card.Subtitle className="mb-3" style={{color:"#E0E0E0"}}>
            Year {" "} 
          {new Date(movie.date).toLocaleString("en-US", {
            year: "numeric",
          })}, {movie.country} , {movie.categories[0]}
          </Card.Subtitle>
          <Row>
            <Col className="mr-3">
              <Card.Link as={Link} to={`/movies/${movie.id}`}>
                <Button    variant="dark button-outline btn btn-primary btn-md" type="button" className="mr-3 mb-3">
                  Watch
                </Button>
              </Card.Link>
            </Col>
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

export default Movie;
