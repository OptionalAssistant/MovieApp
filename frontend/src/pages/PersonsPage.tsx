import  { useRef, useCallback, useState, useEffect } from "react";
import PersonList from "../components/PersonList";
import SearchButton from '../components/SearchButton';
import { useFetchPersonsQuery } from "../redux/query";
import { IPerson } from "../types/typesRest";

function Persons(props: any) {
  const [page, setPage] = useState(1);
  const { data: persons, isError, isLoading } = useFetchPersonsQuery(page);
  const observer = useRef<IntersectionObserver | null>(null);

  const [noMoreData, setNoMoreData] = useState(false);
  const [peopleList ,setPeopleList] = useState<IPerson[]>([])
  
    const lastPersonElementRef = useCallback(
      (node: HTMLElement | null) => {
        if (isLoading || noMoreData) {
          if (observer.current) observer.current.disconnect(); 
          return;
        }

        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !noMoreData ) {
            setPage((prevPage) => prevPage + 1);
          }
        });

        if (node) observer.current.observe(node);
      },
      [isLoading, noMoreData]
    );

  useEffect(() => {
    if (persons) {

      if (persons.length === 0) {
        setNoMoreData(true); 
      } else {
        setPeopleList((prevPeopleList) => [
          ...prevPeopleList,
          ...persons,
        ]);
      }
    }
  }, [persons]);

  if (isLoading && page === 1) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    <>
      <h1>Actors: </h1>
      <SearchButton placeholder="Enter actor name" navigationLink="/search/actor/?name="/>
      {persons && (
        <PersonList persons={peopleList} />
      )}
      <div ref={lastPersonElementRef}></div>
    </>
  );
}

export default Persons;