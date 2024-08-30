import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import { useFetchFreshMoviesQuery } from "../redux/query";
import { movieNumber } from "../types/typesRest";
import { constructPaginationList, MovieCount } from "../utils/utils";
import MovieList from "./MovieList";
import Row from "react-bootstrap/esm/Row";

function NewMovies(props: any) {

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  
  const { id } = useParams();

  const {data :movies,isLoading,error} = useFetchFreshMoviesQuery(`${id}`);
  
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
              link: '/new-movies/',
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
  if(movies?.movies && !isLoading)
  {
    console.log("WHHHSHSHSHS");
  }
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
