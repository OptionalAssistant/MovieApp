import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import MovieList from "../components/MovieList";
import { useFetchBestMoviesQuery } from "../redux/query";
import { constructPaginationList, MovieCount } from "../utils/utils";

function BestMovies(){

    const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
    
    const { id } = useParams();

    const {data : movies ,isError,error,isLoading} = useFetchBestMoviesQuery(Number(id));

    useEffect(()=>{
      if (!isLoading && movies) {
        let items: any;
        const pageCount = Math.ceil(movies.total / MovieCount);
    
        items = constructPaginationList({
          pageCount: pageCount,
          link: "/most-likes/",
          curPage: Number(id),
        });
    
        setPaginationItems(items);
      }
    },[movies,isLoading]);

    if(isError)
      return <h1>Failed to fetch movies...</h1>
      
    return (
      <>
        <h1>Most liked movies</h1>
  
        {movies?.movies && !isLoading  && (
          <>
            <MovieList  movies={movies.movies}/>
            <Row> {paginationItems}</Row>
          </>
        )}
  
      </>
    );
}

export default BestMovies;