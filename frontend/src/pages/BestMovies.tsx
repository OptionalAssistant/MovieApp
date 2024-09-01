import { useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import axios from "../axios";
import MovieList from "../components/MovieList";
import { useFetchBestMoviesQuery } from "../redux/query";
import { movieNumber } from "../types/typesRest";
import { constructPaginationList, MovieCount } from "../utils/utils";

function BestMovies(){

    const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
    
    const { id } = useParams();

    const {data : movies ,isError,error,isLoading} = useFetchBestMoviesQuery(Number(id));
    useEffect(() => {
      const fetchData = async () => {
        try {
     
          const fetchData = async () => {
            try {
         
              const size = await axios.get<movieNumber[]>(`/movies/number`);
              let items: any;
              const pageCount = Math.ceil(size.data.length /MovieCount);
              items = constructPaginationList({
                pageCount: pageCount,
                link: '/most-likes/',
                curPage: Number(id),
              });
      
              setPaginationItems(items);
            } catch (error) {
              console.log("Failed to fetch movies...\n");
            }
          };
      
          fetchData();
        } catch (error) {
          console.log("Failed to fetch movies...\n");
        }
      };
  
      fetchData();
    }, [id]);

    console.log("MVIS",movies);

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