import { useEffect, useState } from "react";
import Row from "react-bootstrap/esm/Row";
import { useParams } from "react-router-dom";
import MovieList from "../components/MovieList";
import { useFetchMovieCategoryPageQuery } from "../redux/query";
import { capitalizeFirstLetter, constructPaginationList, MovieCount } from "../utils/utils";


function Categories(props: any) {
  let { idCategory ,id} = useParams();

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  const {data: categories,error,isLoading} = useFetchMovieCategoryPageQuery(`categories/${idCategory}/page/${id}`);
  useEffect(() => {

   
      if(categories){
      const pageCount = Math.ceil(categories.total / MovieCount);
      const strLink = `categories/${idCategory}/page/`;
      let items: any;

      items =  constructPaginationList({pageCount: pageCount,link : strLink,curPage:  Number(id)});


      setPaginationItems(items);
  
    }
  }, [idCategory,id]);

  return (
    <>
      <h1>Categorie: {capitalizeFirstLetter(idCategory as string)}</h1>
      {categories?.movies && !isLoading && (
          <>
          <MovieList  movies={categories.movies}/>
          <Row> {paginationItems}</Row>
        </>
      )}
       {categories?.movies.length === 0 && !isLoading && (
        <>
          <h1>None</h1>
        </>
      )}
    </>
  );
}

export default Categories;
