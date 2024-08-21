import { useEffect, useState } from "react";
import { fetchFreshMovies } from "../redux/slices/movie";
import { useAppDispatch, useAppSelector } from "../redux/store";
import Col from "react-bootstrap/esm/Col";
import Movie from "../components/Movie";
import { useParams } from "react-router-dom";
import { constructPaginationList, MovieCount } from "../utils/utils";
import Page from "./Page";
import { movieNumber } from "../types/typesRest";
import axios from "../axios";

function NewMovies(props: any) {
  const movies = useAppSelector((state) => state.movies);
  const dispatch = useAppDispatch();

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(fetchFreshMovies(`/movies-new/${id}`));
        const size = await axios.get<movieNumber[]>(`/movies/number`);
        let items: any;
        const pageCount = Math.ceil(size.data.length /MovieCount);
        items = constructPaginationList({
          pageCount: pageCount,
          link: '/new-movies/',
          curPage: Number(id),
        });

        setPaginationItems(items);
      } catch (error) {
        console.log("Failed to fetch movies...\n");
      }
    };

    fetchData();
  }, [id]);
  if(movies.movies && !movies.loading)
  {
    console.log("WHHHSHSHSHS");
  }
  return (
    <>
      <h1>New movies</h1>

      {movies.movies && !movies.loading && (
        <>
          <Page items={paginationItems} />
        </>
      )}

    </>
  );
}

export default NewMovies;
