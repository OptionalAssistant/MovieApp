import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { IMovie } from "../types/typesRest";
import IMovieStore from "../context/contextMovie";
import { useContext } from "react";

function Categories() {
  const navigate = useNavigate();
  const movieContext = useContext(IMovieStore);

  const handleCategory = async (endpoint: string) => {
    movieContext.dispatch({ type: "pending", payload: null });
    try {
      const data = await axios.get<IMovie[]>(endpoint);

      movieContext.dispatch({ type: "fullfilled", payload: data.data });
      console.log(data);
    } catch (error) {
      movieContext.dispatch({ type: "rejected", payload: null });
      
      console.log("Categories error", error);
    }

    navigate(endpoint);
  };
  return (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item onClick={() => handleCategory("categories/fantasy")}>
        Fantasy
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleCategory("categories/thriller")}>
        Thriller
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleCategory("categories/western")}>
        Western
      </Dropdown.Item>
    </DropdownButton>
  );
}

export default Categories;
