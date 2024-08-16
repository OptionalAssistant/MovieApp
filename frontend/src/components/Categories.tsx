import { useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useNavigate } from "react-router-dom";
import { fetchCategories } from "../redux/slices/category";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { capitalizeFirstLetter } from "../utils/utils";

function Categories() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.categories.loading);
  const categories = useAppSelector((state) => state.categories.categories);

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);
  const handleCategory = async (endpoint: string) => {
    navigate(endpoint);
  };

  return (
    <DropdownButton id="dropdown-basic-button" title="Dropdown button">
      {!loading &&
          categories.map((data) => (
            <Dropdown.Item
            onClick={() => handleCategory(`categories/${data.name}/page/1`)}
          >
            {capitalizeFirstLetter(data.name)}
          </Dropdown.Item>
          ))}
    </DropdownButton>
  );
}

export default Categories;
