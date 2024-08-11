import { Link, useParams } from "react-router-dom";
import Page from "../pages/Page";
import { useContext, useEffect, useState } from "react";
import IMovieStore from "../context/contextMovie";
import axios from "../axios";
import { IMovie, movieNumber } from "../types/typesRest";
import Pagination from "react-bootstrap/esm/Pagination";
import { constructPaginationList } from "../utils/utils";
import DropdownCategories from '../components/Categories'

function NumericPage(props: any) {
  let { id } = useParams<string>();
  let numericId: number;

  if (id) numericId = Number(id);
  else  numericId = 1;
  

  const movieContext = useContext(IMovieStore);

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        movieContext.dispatch({ type: "pending", payload: null });
        try {
          const { data } = await axios.get<IMovie[]>(`/movies/pages/${numericId}`);
          const size = await axios.get<movieNumber[]>(`/movies/number`);
        
          movieContext.dispatch({ type: "fullfilled", payload: data });

          const pageCount = Math.ceil(size.data.length / 9);
        
          let items: any;
          
           items =  constructPaginationList({pageCount: pageCount,link :'/pages/',curPage:numericId});

           setPaginationItems(items);
          }

         catch (error) {
          movieContext.dispatch({ type: "rejected", payload: null });
          console.log("Error during fetch movies", error);
        }
      };

      fetchData();
    }, [numericId]);
  return (
    <>
      {movieContext.state.movies && !movieContext.state.loading && (
        <>
      <Page items={paginationItems} />
        </>
      )}
    </>
  );
}

export default NumericPage;
