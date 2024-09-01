import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Row } from "react-bootstrap";
import MovieList from "../components/MovieList";
import { useFetchPersonSearchPageQuery } from "../redux/query";
import { constructPaginationList, MovieCount } from "../utils/utils";
import PersonList from "../components/PersonList";


function Search(props : any) {
  const [searchParams] = useSearchParams();

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  let page = searchParams.get("page");
  if (!page) page = "1";

  const {
    data : people,
    error,
    isLoading,
  } = useFetchPersonSearchPageQuery(
    `search/actor/?name=${searchParams.get("name")}&page=${page}`
  );

  return (
    <>
      {people && !isLoading && (
        <>
          <h1>Results on search: {searchParams.get("name")}</h1>
          <PersonList persons={people.people} />
        </>
      )}
      {!people && !isLoading && (
        <h1>Movie with name: {searchParams.get("name")} not found</h1>
      )}
    </>
  );
}

export default Search;
