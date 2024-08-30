import { useParams } from "react-router-dom";
import { useFetchFullPersonQuery } from "../redux/query";
import MovieList from "./MovieList";


function FullPerson() {

    const {id} = useParams();

    const {data: person,isError,isLoading} = useFetchFullPersonQuery(Number(id));

    if(isLoading)
        return <h1>Loading</h1>

    if(isError || !person)
        return <h1>Error</h1>

    const formattedDate = new Date(person.date).toLocaleString(
        "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        }
      );

    return (
    <>
    <h1>Name: {person.name}</h1>
    <div>
          <img
            src={`http://localhost:4444/uploads/${person.avatarUrl}`}
            alt=""
            width="188px"
            height="277px"
          />
        </div>
    <p>Дата рождения :{formattedDate} </p>
    <p>Место рождения :{person.birthplace}</p>
    <p>Рост: {person.tall}</p>
    <h2>Актер: </h2>
    {<MovieList movies={person.actorMovies}/>}
    <h2>Режиссер</h2>
    {<MovieList movies={person.directorMovies}/>}

    </>);
}

export default FullPerson;
