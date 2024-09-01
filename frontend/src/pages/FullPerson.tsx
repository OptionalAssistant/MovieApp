import { useParams } from "react-router-dom";
import MovieList from "../components/MovieList";
import { useFetchFullPersonQuery } from "../redux/query";

function FullPerson() {
  const { id } = useParams();

  const {
    data: person,
    isError,
    isLoading,
  } = useFetchFullPersonQuery(Number(id));

  if (isLoading) return <h1>Loading</h1>;

  if (isError || !person) return <h1>Error</h1>;

  const formattedDate = new Date(person.date).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
            <h1>Name: {person.name}</h1>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          flexDirection: "row",
        }}
      >
        <div>
          <img
            src={`http://localhost:4444/uploads/${person.avatarUrl}`}
            alt=""
            width="188px"
            height="277px"
          />
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
        <p>Date of birth :{formattedDate} </p>
        <p>Birthplace :{person.birthplace}</p>
        <p>Height: {person.tall}</p>
        </div>
      </div>
      <h2>Actor: </h2>
      {<MovieList movies={person.actorMovies} />}
      <h2>Director</h2>
      {<MovieList movies={person.directorMovies} />}
    </>
  );
}

export default FullPerson;
