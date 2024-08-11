import { useParams } from "react-router-dom";
import IMovieStore from "../context/contextMovie";
import { useContext, useEffect, useState } from "react";
import { constructPaginationList } from "../utils/utils";
import Page from "./Page";

function Categories(props: any) {
  const { idCategory } = useParams();
  const movieContext = useContext(IMovieStore);
  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);
  useEffect(() => {

    let items: any;

    items = constructPaginationList({
      pageCount: 1,
      link: "/pages/",
      curPage: 1,
    });

    setPaginationItems(items);
  }, [idCategory]);

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
