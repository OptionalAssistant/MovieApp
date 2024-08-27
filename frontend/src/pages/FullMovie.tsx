import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import { Link, useParams } from "react-router-dom";
import axios from "../axios";
import Comments from "../components/Comments";
import { IFullMovie } from "../types/typesRest";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import { useDislikeMovieMutation, useFetchFullMovieQuery, useLikeMovieMutation } from "../redux/query";

function FullMovie() {
  const { id } = useParams();

  const [likeMovie] = useLikeMovieMutation();
  const [dislikeMovie] = useDislikeMovieMutation();
  const [isLiked,setLiked] = useState(false);
  const [isDisliked,setDisliked] = useState(false);
  const handleDislike = () => {
    dislikeMovie(Number(id)).then(()=>setDisliked(!isDisliked)).catch(err => {
      console.error('Failed to dislike movie:', err);
    });
  };
  const handleLike = () => {
    console.log("Is liked",isLiked);
    likeMovie(Number(id)).then(()=>setLiked(!isLiked)).catch(err => {
      console.error('Failed to like movie:', err);
    });
  };

   const { data : movie, isLoading,error } = useFetchFullMovieQuery( Number(id));
 
    useEffect(()=>{
      if(movie && !isLoading){
        setDisliked(movie.isDisliked);
        setLiked(movie.isLiked);
      }
    },[movie, isLoading, error]);

  return movie ? (
    <>
      <Row className="justify-content-md-center">
        {" "}
        <h1>{movie.name}</h1>
        <h4>Страна {movie.country}</h4>
        <h4>
          {" "}
          Дата выхода{" "}
          {new Date(movie.date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </h4>
        <Row>
          {" "}
          <h4>Dislikes : {movie.dislikeCount} </h4>
          <Col lg={1}>
            <Button variant={movie.isDisliked ? "danger" : "light"} size="lg"  onClick={handleDislike}>
              Dislike
            </Button>{" "}
          </Col>
        </Row>
        <Row>
          {" "}
          <h4>Likes : {movie.likeCount}</h4>  
          <Col lg={1}>
            <Button variant={movie.isLiked ? "danger" : "light"} size="lg" onClick={handleLike}>
              Like
            </Button>{" "}
          </Col>
        </Row>

        <div>
          <img
            src={`http://localhost:4444/uploads/${movie.imageUrl}`}
            alt=""
            width="188px"
            height="277px"
          />
        </div>
      </Row>
      <Row>
        <h3>Categories </h3>
        {!movie.categories.length ? (
          <h2>None</h2>
        ) : (
          movie.categories.map((item, index) => {
            return (
              <Link to={`/categories/${item}/page/1`}>
                <h4>{item}</h4>
                <br />
              </Link>
            );
          })
        )}
      </Row>
      <Row className="pb-4">
        <h2>Трейлер</h2>
        <div>
          <iframe
            width="560"
            height="315"
            style={{ border: "none" }}
            src={movie.trailerUrl}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <h2>О чем фильм {movie.name}</h2>
        <p>{movie.description}</p>
      </Row>

      <Comments id={id} count={movie.commentCount} />
    </>
  ) : null;
}

export default FullMovie;
