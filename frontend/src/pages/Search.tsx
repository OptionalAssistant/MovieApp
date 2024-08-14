import {
  Link,
  useLocation,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { IMovieSearchForm, ISearchMovieResponse } from "../types/typesRest";
import { useContext, useEffect, useState } from "react";
import MovieContext from "../context/contextMovie";
import axios from "../axios";
import Page from "./Page";
import { constructPaginationList } from "../utils/utils";

function Search(props: any) {
  const [searchParams] = useSearchParams();
  const movieContext = useContext(MovieContext);

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  let page = searchParams.get("page");

  if (!page) page = "1";

  useEffect(() => {
    const fetchData = async () => {
      movieContext.dispatch({ type: "pending", payload: null });
      try {
 
        const { data } = await axios.get<ISearchMovieResponse>(
          `search/?name=${searchParams.get("name")}&page=${page}`
        );

        let items: any;
        const pageCount = Math.ceil(data.total / 1);
        const strLink = `search/?name=${searchParams.get("name")}&page=`
        items =  constructPaginationList({pageCount: pageCount,link : strLink,curPage:  Number(page)});


        setPaginationItems(items);
;
        movieContext.dispatch({ type: "fullfilled", payload: data.movies });
      } catch (error) {
        movieContext.dispatch({ type: "rejected", payload: null });
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <>
      {movieContext.state.movies && !movieContext.state.loading && (
        <>
        <h1>Results on search: {searchParams.get("name")}</h1>
        <Page items={paginationItems} />
          </>
      )}
       {!movieContext.state.movies && !movieContext.state.loading && (
        <h1>Movie with name: {searchParams.get("name")} not found</h1>
      )}
    </>
  );
}

export default Search;
