import Card from "react-bootstrap/esm/Card";
import { IMovie } from "../types/typesRest";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import axios from "../axios";
import { fetchMoviePage } from "../redux/slices/movie";

function Movie({ movie }: { movie: IMovie }) {
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();
  const {id} = useParams();
  const navigate = useNavigate();

  const onDelete =async  ()=>{
    try{
      await axios.delete(`/movies/delete/${movie.id}`);
      alert("Movie sucessfully deleted");
      
    }

    catch(eror){
      alert("ERROR");
    }
    
  }
  const onEdit = async()=>{
    navigate(`/admin-panel/add/${movie.id}/edit`);
  }
  return (
    <>
    <Card className="card-fixed">
      <div></div>
      <Card.Link as={Link} to={`/movies/${movie.id}`}>
        {" "}
        <Card.Img
          variant="top"
          src={`http://localhost:4444/uploads/${movie.imageUrl}`}
        />
      </Card.Link>

      <Card.Body>
        <Card.Title className="mb-3">{movie.name}</Card.Title>
        <Card.Subtitle className="mb-3">
          {movie.date}, {movie.country} , {movie.categories[0]}
        </Card.Subtitle>
        <Row>
          <Col className="mr-3">
            <Card.Link as={Link} to={`/movies/${movie.id}`}>
              <Button variant="primary" type="button" className="mr-3">
                Watch
              </Button>
            </Card.Link>
          </Col>
          {user && user.roles === 'ADMIN' && user.isActivated && (
            <>
              <Col className="mr-3">
                <Button variant="danger" type="button" className="mr-3" onClick={onDelete}>
                  Delete
                </Button>
              </Col>
              <Col className="mr-3">
                <Button variant="info" type="button" className="mr-3" onClick={onEdit}>
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
