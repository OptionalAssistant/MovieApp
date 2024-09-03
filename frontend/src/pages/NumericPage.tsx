import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Row from "react-bootstrap/esm/Row";
import MovieList from "../components/MovieList";
import { useFetchMoviePageQuery } from "../redux/query";
import { constructPaginationList, MovieCount } from "../utils/utils";

function NumericPage(props: any) {
  
  const { id } = useParams();
  let numericId: number;

  if (id) numericId = Number(id);
  else numericId = 1;

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  const { data : movies , isError, error, isLoading } = useFetchMoviePageQuery(numericId);

  useEffect(()=>{
    if (!isLoading && movies) {
      let items: any;
      console.log("Number id",numericId );
      const pageCount = Math.ceil(movies.total / MovieCount);
      console.log("Movieeee",movies.total,pageCount);
      items = constructPaginationList({
        pageCount: pageCount,
        link: "/pages/",
        curPage: Number(numericId),
      });
      console.log("commmon");
      setPaginationItems(items);
    
    }
  },[movies,isLoading]);

  if (isError) return <h1>Failed to fetch movies...</h1>;


  return (
    <>
      {movies && !isLoading && (
        <>
          <MovieList movies={movies.movies} />
          <Row>   {paginationItems}</Row>
        </>
      )}
    </>
  );
}

export default NumericPage;
