import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import { useParams } from "react-router-dom";
import MovieList from "../components/MovieList";
import ProfilerNav from "../components/ProfileNav";
import { useFetchUserDisikedMoviesQuery } from "../redux/query";
import { constructPaginationList, MovieCount } from "../utils/utils";

function DislikedMovies() {
  const {id} = useParams();

  const {
    data: movies,
    isLoading,
    isError,
  } = useFetchUserDisikedMoviesQuery(Number(id));

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);



  useEffect(()=>{
    if (!isLoading && movies) {
      let items: any;
      const pageCount = Math.ceil(movies.total / MovieCount);
  
      items = constructPaginationList({
        pageCount: pageCount,
        link: "/profile/disliked/",
        curPage: Number(id),
      });
  
      setPaginationItems(items);
    }
  },[movies,isLoading]);

  if (isError) return <h1>Failed to fetch movies...</h1>;

  return (
    <>
      <ProfilerNav />
      <h1>Disliked movies</h1>

      {!isLoading && movies && (
        <>
          <MovieList movies={movies.movies} />
          <Row> {paginationItems}</Row>
        </>
      )}
    </>
  );
}

export default DislikedMovies;
