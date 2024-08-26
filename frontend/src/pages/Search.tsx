import { useEffect, useState } from "react";
import {
  useSearchParams
} from "react-router-dom";

import { constructPaginationList, MovieCount } from "../utils/utils";
import Page from "./Page";
import { useFetchMovieSearchPageQuery } from "../redux/query";

function Search(props: any) {
  const [searchParams] = useSearchParams();


  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  let page = searchParams.get("page");
  const {data : movies,error,isLoading} = useFetchMovieSearchPageQuery(`search/?name=${searchParams.get("name")}&page=${page}`);

  if (!page) page = "1";

  useEffect(() => {
    if(movies){
        let items: any;
        const pageCount = Math.ceil(movies.total / MovieCount);
        const strLink = `search/?name=${searchParams.get("name")}&page=`
        items =  constructPaginationList({pageCount: pageCount,link : strLink,curPage:  Number(page)});

        setPaginationItems(items);
      } 
  }, []);

  return (
    <>
      {movies && !isLoading && (
        <>
        <h1>Results on search: {searchParams.get("name")}</h1>
        <Page items={paginationItems} movies={movies.movies}/>
          </>
      )}
       {!movies && !isLoading && (
        <h1>Movie with name: {searchParams.get("name")} not found</h1>
      )}
    </>
  );
}

export default Search;
