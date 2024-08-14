import { useParams } from "react-router-dom";
import IMovieStore from "../context/contextMovie";
import { useContext, useEffect, useState } from "react";
import { constructPaginationList } from "../utils/utils";
import Page from "./Page";
import { IMovie, ISearchMovieResponse } from "../types/typesRest";
import axios from "../axios";

function Categories(props: any) {
  let { idCategory ,id} = useParams();
  const movieContext = useContext(IMovieStore);


  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  useEffect(() => {

    const fetchData = async () => {

    movieContext.dispatch({ type: "pending", payload: null });
    try {
      const {data} = await axios.get<ISearchMovieResponse>(`categories/${idCategory}/page/${id}`);
      
      const pageCount = Math.ceil(data.total / 1);
      const strLink = `categories/${idCategory}/page/`;
      let items: any;

      items =  constructPaginationList({pageCount: pageCount,link : strLink,curPage:  Number(id)});


      setPaginationItems(items);

      movieContext.dispatch({ type: "fullfilled", payload: data.movies });
    } catch (error) {
      movieContext.dispatch({ type: "rejected", payload: null });

      
    }
  }
    fetchData();
  }, [idCategory,id]);

  return (
    <>
      <h1>Categorie: {idCategory}</h1>
      {movieContext.state.movies && !movieContext.state.loading && (
        <>
          <Page items={paginationItems} />
        </>
      )}
    </>
  );
}

export default Categories;
