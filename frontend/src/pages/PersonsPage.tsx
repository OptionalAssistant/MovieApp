import { Button, Form } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import PersonList from "../components/PersonList";
import { useFetchPersonsQuery } from "../redux/query";
import { IMovieSearchForm } from "../types/typesRest";
import SearchButton from '../components/SearchButton';

function Persons(props: any) {
  const { data : persons, isError, isLoading } = useFetchPersonsQuery();

  const navigate = useNavigate();
  
  const onSubmit: SubmitHandler<IMovieSearchForm> = async (
    value: IMovieSearchForm
  ) => {
    navigate(`/search/actor/?name=${value.name}`);
  };

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IMovieSearchForm>({ mode: "onSubmit" });
  
  if (isLoading) return <h1>Loading</h1>;

  if (isError) return <h1>Error</h1>;

  return (
    <>
      <h1>Actors: </h1>

     <SearchButton placeholder="Enter actor name" navigationLink="/search/actor/?name="/>
          
      {persons && <PersonList persons={persons}/>}
    </>
  );
}

export default Persons;
