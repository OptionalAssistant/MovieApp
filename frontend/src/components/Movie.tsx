import Card from "react-bootstrap/esm/Card";
import { IMovie } from "../types/typesRest";
import { Link, useLocation } from "react-router-dom";
import Button from "react-bootstrap/esm/Button";

function  Movie({ movie }: { movie: IMovie }) {

  return (
    <Card className="card-fixed">
      <div></div>
      <Card.Link as={Link} to={`/movies/${movie.id}`}>
        {" "}
        <Card.Img
          variant="top"
          src={`http://localhost:4444${movie.imageUrl}`}
        />
      </Card.Link>

      <Card.Body>
        <Card.Title className="mb-3">{movie.name}</Card.Title>
        <Card.Subtitle className="mb-3">
          {movie.date}, {movie.country}  , {movie.categories[0]} 
        </Card.Subtitle>
        <Card.Link as={Link} to={`/movies/${movie.id}`}>
          <Button variant="primary" type="button">
            Watch
          </Button>
        </Card.Link>
      </Card.Body>
    </Card>
  );
}

export default Movie;
