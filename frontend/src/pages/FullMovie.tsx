import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import { Link, useParams } from "react-router-dom";
import axios from "../axios";
import Comments from "../components/Comments";
import { IFullMovie } from "../types/typesRest";
function FullMovie() {
  const { id } = useParams();
  const [movie, setData] = useState<IFullMovie>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<IFullMovie>(`/movies/full/${id}`);
      setData(data);
      console.log("data",data);
    };
    fetchData();
  }, [id]);

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
            day : "numeric"
          })}
        </h4>
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
