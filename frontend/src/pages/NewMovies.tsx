import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import { useParams } from "react-router-dom";
import MovieList from "../components/MovieList";
import { useFetchFreshMoviesQuery } from "../redux/query";
import { constructPaginationList, MovieCount } from "../utils/utils";

function NewMovies(props: any) {

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  
  const { id } = useParams();

  const {data :movies,isLoading,isError} = useFetchFreshMoviesQuery(`${id}`);
  


  useEffect(()=>{
    if (!isLoading && movies) {
      let items: any;
      const pageCount = Math.ceil(movies.total / MovieCount);

      items = constructPaginationList({
        pageCount: pageCount,
        link: "/new-movies/",
        curPage: Number(id),
      });
  
      setPaginationItems(items);
    }
  },[movies,isLoading]);

  if (isError) return <h1>Failed to fetch movies...</h1>;

  return (
    <>
      <h1>New movies</h1>

      {movies?.movies && !isLoading && (
      <>
      <MovieList movies={movies.movies} />
      <Row> {paginationItems}</Row>
    </>
      )}

    </>
  );
}

export default NewMovies;
