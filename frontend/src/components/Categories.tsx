import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useNavigate } from "react-router-dom";

import { useFetchCategoriesQuery } from "../redux/query";
import { capitalizeFirstLetter } from "../utils/utils";

function Categories() {
  const navigate = useNavigate();

  const {data,isLoading,isError} = useFetchCategoriesQuery();
  
  const handleCategory = async (endpoint: string) => {
    navigate(endpoint);
  };

  return (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      {!isLoading && !isError && data &&
          data.map((item) => (
            <Dropdown.Item
            onClick={() => handleCategory(`categories/${item.name}/page/1`)}
          >
            {capitalizeFirstLetter(item.name)}
          </Dropdown.Item>
          ))}
    </DropdownButton>
  );
}

export default Categories;
