import { useParams } from "react-router-dom";

import Page from "./Page";
import { useEffect, useState } from "react";
import { movieNumber } from "../types/typesRest";
import axios from "../axios";
import { constructPaginationList, MovieCount } from "../utils/utils";
import { useFetchFreshMoviesQuery, useFetchPopularMoviesQuery } from "../redux/query";

function PopularMovies(){

    const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
    
    const { id } = useParams();

    const {data : movies ,isError,error,isLoading} = useFetchPopularMoviesQuery(Number(id));
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
                link: '/movies-popular/',
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
        <h1>Popular movies</h1>
  
        {movies?.movies && !isLoading  && (
          <>
            <Page items={paginationItems} movies={movies.movies}/>
          </>
        )}
  
      </>
    );
}

export default PopularMovies;