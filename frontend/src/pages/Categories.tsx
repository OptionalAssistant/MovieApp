import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieCategoryPage } from "../redux/slices/movie";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { capitalizeFirstLetter, constructPaginationList } from "../utils/utils";
import Page from "./Page";

function Categories(props: any) {
  let { idCategory ,id} = useParams();

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  const dispatch = useAppDispatch();
  const movies = useAppSelector(state => state.movies.movies);
  const loading = useAppSelector(state=>state.movies.loading);
  
  useEffect(() => {

    const fetchData = async () => {

    try {
      const data = await dispatch(fetchMovieCategoryPage(`categories/${idCategory}/page/${id}`)).unwrap();
      
      const pageCount = Math.ceil(data.total / 1);
      const strLink = `categories/${idCategory}/page/`;
      let items: any;

      items =  constructPaginationList({pageCount: pageCount,link : strLink,curPage:  Number(id)});


      setPaginationItems(items);
    } catch (error) {
     console.log("Failed to get category page");

      
    }
  }
    fetchData();
  }, [idCategory,id]);

  return (
    <>
      <h1>Categorie: {capitalizeFirstLetter(idCategory as string)}</h1>
      {movies&& !loading && (
        <>
          <Page items={paginationItems} />
        </>
      )}
       {!movies?.length&& !loading && (
        <>
          <h1>None</h1>
        </>
      )}
    </>
  );
}

export default Categories;
