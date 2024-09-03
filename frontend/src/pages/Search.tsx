import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Row } from "react-bootstrap";
import MovieList from "../components/MovieList";
import { useFetchMovieSearchPageQuery } from "../redux/query";
import { constructPaginationList, MovieCount } from "../utils/utils";


function Search(props : any) {
  const [searchParams] = useSearchParams();

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  let page = searchParams.get("page");
  if (!page) page = "1";

  const {
    data : movies,
    isLoading,
    isError
  } = useFetchMovieSearchPageQuery(
    `search/main/?name=${searchParams.get("name")}&page=${page}`
  );

  useEffect(() => {
    if (movies) {
      let items: any;
      const pageCount = Math.ceil(movies.total / MovieCount);
      const strLink = `search/main/?name=${searchParams.get("name")}&page=`;
      items = constructPaginationList({
        pageCount: pageCount,
        link: strLink,
        curPage: Number(page),
      });

      setPaginationItems(items);
    }
  }, [movies]);

  return (
    <>
      {movies && !isError && !isLoading  && (
        <>
          <h1>Results on search: {searchParams.get("name")}</h1>
          <MovieList movies={movies.movies} />
          <Row> {paginationItems}</Row>
        </>
      )}
      {isError && !isLoading && (
        <h1>Movie with name: {searchParams.get("name")} not found</h1>
      )}
    </>
  );
}

export default Search;
