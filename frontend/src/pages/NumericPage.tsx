import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../pages/Page";

import axios from "../axios";
import { movieNumber } from "../types/typesRest";
import { constructPaginationList, MovieCount } from "../utils/utils";
import { useFetchMoviePageQuery } from "../redux/query";

function NumericPage(props: any) {
  let { id } = useParams<string>();
  let numericId: number;

  if (id) numericId = Number(id);
  else numericId = 1;

  const [paginationItems, setPaginationItems] = useState<JSX.Element[]>([]);

  const {data ,isError,error,isLoading} = useFetchMoviePageQuery(numericId);

  
  useEffect(() => {
    const fetchData = async () => {
      try {

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
      {data&& !isLoading && (
        <>
          <Page items={paginationItems} movies={data}/>
        </>
      )}
    </>
  );
}

export default NumericPage;
