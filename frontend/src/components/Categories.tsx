import { useContext } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useNavigate } from "react-router-dom";
import IMovieStore from "../context/contextMovie";

function Categories() {
  const navigate = useNavigate();
  const movieContext = useContext(IMovieStore);

  const handleCategory = async (endpoint: string) => {
  
    navigate(endpoint);
  };
  return (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      <Dropdown.Item onClick={() => handleCategory("categories/fantasy/page/1")}>
        Fantasy
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleCategory("categories/thriller/page/1")}>
        Thriller
      </Dropdown.Item>
      <Dropdown.Item onClick={() => handleCategory("categories/western/page/1")}>
        Western
      </Dropdown.Item>
    </DropdownButton>
  );
}

export default Categories;
