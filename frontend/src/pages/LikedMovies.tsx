import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import { useParams } from "react-router-dom";
import MovieList from "../components/MovieList";
import ProfilerNav from "../components/ProfileNav";
import { useFetchUserLikedMoviesQuery } from "../redux/query";
import { constructPaginationList, MovieCount } from "../utils/utils";

function LikedMovies() {
  const {id} = useParams();

  const { data: movies, isLoading ,isError} = useFetchUserLikedMoviesQuery(Number(id));

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);



  useEffect(()=>{
    if (!isLoading && movies) {
      let items: any;
      const pageCount = Math.ceil(movies.total / MovieCount);
      console.log("1111",movies.total,pageCount);
      items = constructPaginationList({
        pageCount: pageCount,
        link: "/profile/liked/",
        curPage: Number(id),
      });
  
      setPaginationItems(items);
    }
  },[movies,isLoading]);

  if (isError) return <h1>Failed to fetch movies...</h1>;
  return (
    <>
      <ProfilerNav />
      <h1>Liked movies</h1>
      
      {!isLoading && movies && (
        <>
          <MovieList movies={movies.movies} />
          <Row> {paginationItems}</Row>
        </>
      )}
    </>
  );
}

export default LikedMovies;
