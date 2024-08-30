import Row from "react-bootstrap/esm/Row";
import { useFetchPersonsQuery } from "../redux/query";
import Col from "react-bootstrap/esm/Col";
import Person from "../components/Person";
import PersonList from "../components/PersonList";

function Persons(props: any) {
  const { data : persons, isError, isLoading } = useFetchPersonsQuery();

  if (isLoading) return <h1>Loading</h1>;

  if (isError) return <h1>Error</h1>;

  return (
    <>
      <h1>Actors: </h1>
      {persons && <PersonList persons={persons}/>}
    </>
  );
}

export default Persons;
