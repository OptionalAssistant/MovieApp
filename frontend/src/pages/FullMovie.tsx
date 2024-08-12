import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../axios";
import { IFullMovie, IMovie } from "../types/typesRest";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Movie from "../components/Movie";
import Categories from "./Categories";
import { ListGroupItem } from "react-bootstrap";

function FullMovie() {
  const { id } = useParams();
  const [movie, setData] = useState<IFullMovie>();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await axios.get<IFullMovie>(`/movies/full/${id}`);
      console.log(data);
      setData(data);
    };
    fetchData();
  }, [id]);
  return movie ? (
    <>
      <Row className="justify-content-md-center">
        {" "}
        <h1>{movie.name}</h1>
        <h4>Страна {movie.country}</h4>
        <h4>Дата выхода {movie.date}</h4>
        <div>
          <img
            src={`http://localhost:4444${movie.imageUrl}`}
            alt=""
            width="188px"
            height="277px"
          />
        </div>
      </Row>
      <Row>
        <h3>Categories </h3>
      {movie.categories.map((item,index)=>
      {
        return <Col key={index}><Link to={`/categories/${item}/page/1`}><h4>{item}</h4></Link></Col>
      })}
        {/* <Link to={`/categories/${movie.categories[0]}/page/1`}><h4>{movie.categories}</h4></Link></Row> */}
      </Row>
      <Row className="pb-3">
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
        <h2>Смотреть</h2>
        <div>
          {/* <video id="videoPlayer" width="650" controls>
          <source src={`http://localhost:4444/movies/video/${id}`} type="video/mp4" />
        </video> */}
        </div>

        <i>Big Buck Bunny</i>
      </Row>
    </>
  ) : null;
}

export default FullMovie;
