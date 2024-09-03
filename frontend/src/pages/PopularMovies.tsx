import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import axios from "../axios";
import MovieList from "../components/MovieList";
import { useFetchPopularMoviesQuery } from "../redux/query";
import { movieNumber } from "../types/typesRest";
import { constructPaginationList, MovieCount } from "../utils/utils";

function PopularMovies() {
  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  const { id } = useParams();

  const {
    data: movies,
    isError,
    error,
    isLoading,
  } = useFetchPopularMoviesQuery(Number(id));

;

  useEffect(()=>{
    if (!isLoading && movies) {
      let items: any;
      const pageCount = Math.ceil(movies.total / MovieCount);
  
      items = constructPaginationList({
        pageCount: pageCount,
        link: "/popular/",
        curPage: Number(id),
      });
  
      setPaginationItems(items);
    }
  },[movies,isLoading]);

  if (isError) return <h1>Failed to fetch movies...</h1>
  return (
    <>
      <h1>Popular movies</h1>

      {movies?.movies && !isLoading && (
        <>
          <MovieList movies={movies.movies} />
          <Row> {paginationItems}</Row>
        </>
      )}
    </>
  );
}

export default PopularMovies;
