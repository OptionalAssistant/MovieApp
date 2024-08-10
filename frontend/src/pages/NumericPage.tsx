import { Link, useParams } from "react-router-dom";
import Page from "../pages/Page";
import { useContext, useEffect, useState } from "react";
import IMovieStore from "../context/contextMovie";
import axios from "../axios";
import { IMovie, movieNumber } from "../types/typesRest";
import Pagination from "react-bootstrap/esm/Pagination";

function NumericPage(props: any) {
  let { id } = useParams<string>();
  let numericId: number;
  if (id) numericId = parseInt(id, 10);
  else numericId = 1;

  const movieContext = useContext(IMovieStore);

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

    useEffect(() => {
      const fetchData = async () => {
        movieContext.dispatch({ type: "pending", payload: null });
        try {
          const { data } = await axios.get<IMovie[]>(`/movies/pages/${numericId}`);
          const size = await axios.get<movieNumber[]>(`/movies/number`);

          movieContext.dispatch({ type: "fullfilled", payload: data });

          const pageCount = size.data.length / 9 + 1;

          const items = [];

          for (let number = 1; number < pageCount; number++) {
            items.push(
              <Pagination.Item
                key={number}
                active={number === props.id}
                as={Link}
                to={`/pages/${number}`}
              >
                {number}
              </Pagination.Item>
            );
          }
          setPaginationItems(items);
        } catch (error) {
          movieContext.dispatch({ type: "rejected", payload: null });
          console.log("Error during fetch movies", error);
        }
      };

      fetchData();
    }, [numericId]);
  return (
    <>
      {movieContext.state.movies && !movieContext.state.loading && (
        <Page items={paginationItems} />
      )}
    </>
  );
}

export default NumericPage;
