import { useEffect, useState } from "react";
import {
  useSearchParams
} from "react-router-dom";

import { fetchMovieSearchPage } from "../redux/slices/movie";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { constructPaginationList, MovieCount } from "../utils/utils";
import Page from "./Page";

function Search(props: any) {
  const [searchParams] = useSearchParams();


  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  const movies =  useAppSelector(state => state.movies.movies);
  const loading = useAppSelector(state=>state.movies.loading) ;
  let page = searchParams.get("page");

  if (!page) page = "1";

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchData = async () => {

      try {
 
        const data = await dispatch(fetchMovieSearchPage(`search/?name=${searchParams.get("name")}&page=${page}`)).unwrap();

        
        let items: any;
        const pageCount = Math.ceil(data.total / MovieCount);
        const strLink = `search/?name=${searchParams.get("name")}&page=`
        items =  constructPaginationList({pageCount: pageCount,link : strLink,curPage:  Number(page)});

        setPaginationItems(items);
          
      }
      catch(error)
      {
        console.log("Failed to fetch movies...\n");
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <>
      {movies && !loading && (
        <>
        <h1>Results on search: {searchParams.get("name")}</h1>
        <Page items={paginationItems} />
          </>
      )}
       {!movies && !loading && (
        <h1>Movie with name: {searchParams.get("name")} not found</h1>
      )}
    </>
  );
}

export default Search;
