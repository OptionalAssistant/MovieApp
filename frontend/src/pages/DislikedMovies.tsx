import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../axios";
import ProfilerNav from '../components/ProfileNav';
import { useFetchUserDisikedMoviesQuery } from "../redux/query";
import { movieNumber } from "../types/typesRest";
import { constructPaginationList, MovieCount } from "../utils/utils";
import Page from "./Page";

function LikedMovies() {    

    const id  = useParams();
    
    const {data : movies,isLoading} = useFetchUserDisikedMoviesQuery(Number(id));

    const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
    
    useEffect(() => {
        const fetchData = async () => {
          try {
    
            const size = await axios.get<movieNumber[]>(`/movies/number`);
    
            const pageCount = Math.ceil(size.data.length / MovieCount);
    
            let items: any;
    
            items = constructPaginationList({
              pageCount: pageCount,
              link: "/profile/disliked/",
              curPage: Number(id),
            });
    
            setPaginationItems(items);
          } catch (error) {
            console.log("Something went wrong during fetchPage");
          }
        };
    
        fetchData();
      }, [id]);
      
    return (
    <>
      <ProfilerNav />
       <h1>Disliked movies</h1>
      
        {!isLoading && movies &&  <Page items={paginationItems} movies={movies}/> }
    </>
  );
}

export default LikedMovies;
