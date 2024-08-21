import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../pages/Page";

import { fetchMoviePage } from "../redux/slices/movie";
import { useAppDispatch, useAppSelector } from "../redux/store";
import axios from "../axios";
import { movieNumber } from "../types/typesRest";
import { constructPaginationList, MovieCount } from "../utils/utils";

function NumericPage(props: any) {
  let { id } = useParams<string>();
  let numericId: number;

  if (id) numericId = Number(id);
  else numericId = 1;

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  const dispatch = useAppDispatch();
  const movies = useAppSelector(state => state.movies.movies) ;
  const loading = useAppSelector(state => state.movies.loading);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchMoviePage(numericId)).unwrap();
        const size = await axios.get<movieNumber[]>(`/movies/number`);

        const pageCount = Math.ceil(size.data.length / MovieCount);

        let items: any;

        items = constructPaginationList({
          pageCount: pageCount,
          link: "/pages/",
          curPage: numericId,
        });

        setPaginationItems(items);
      } catch (error) {
        console.log("Something went wrong during fetchPage");
      }
    };

    fetchData();
  }, [numericId]);
  return (
    <>
      {movies&& !loading && (
        <>
          <Page items={paginationItems} />
        </>
      )}
    </>
  );
}

export default NumericPage;
