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
import { IMovie } from "../types/typesRest";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Movie from "../components/Movie";
import { Pagination } from "react-bootstrap";
import Page from "./Page";

function Search(props: any) {
  const [searchParams] = useSearchParams();
  const movieContext = useContext(MovieContext);

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  
  console.log(searchParams);
  const location = useLocation();
  let page = searchParams.get("page");

  if (!page) page = "1";

  useEffect(() => {
    const fetchData = async () => {
      movieContext.dispatch({ type: "pending", payload: null });
      try {
        const { data } = await axios.get<ISearchMovieResponse>(
          `search/?name=${searchParams.get("name")}&page=${page}`
        );

        const items = [];
        const pageCount = data.total / 9 + 1;
        
        for (let number = 1; number < pageCount; number++) {
          items.push(
            <Pagination.Item
              key={number}
              active={number === props.id}
              as={Link}
              to={ `?name=${searchParams.get("name")}&page=${number}`}
            >
              {number}
            </Pagination.Item>
          );
        }
        setPaginationItems(items);

        movieContext.dispatch({ type: "fullfilled", payload: data.movies });
      } catch (error) {
        movieContext.dispatch({ type: "rejected", payload: null });
        console.log("Error during fetch movies", error);
      }
    };

    fetchData();
  }, [searchParams]);

  console.log("Query", searchParams);

  return (
    <>
      {movieContext.state.movies && !movieContext.state.loading && (
        <Page items={paginationItems} />
      )}
    </>
  );
}

export default Search;
