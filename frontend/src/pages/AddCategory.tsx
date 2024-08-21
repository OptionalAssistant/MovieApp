import { useEffect } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "../axios";
import { fetchCategories } from "../redux/slices/category";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { ICategory } from "../types/typesRest";

function AddCategory(props: any) {


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ICategory>({ mode: "onChange" });

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const user = useAppSelector(state => state.auth.user);
  const onSubmit: SubmitHandler<ICategory> = async (value: ICategory) => {
    console.log("Log value", value);
    axios
      .post("add-category", value)
      .then(() => {console.log("all right");   dispatch(fetchCategories());alert("Category added")})
      .catch((error) => console.log("Smth went wrong", error));

   
  };


  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedCategory = event.currentTarget.elements.namedItem('category') as HTMLSelectElement;
    const value  : ICategory = { name: selectedCategory.value };
    try {
      await axios.delete("/remove-category", { data: value });
      console.log("Category deleted successfully");
      alert("Category removed");
      dispatch(fetchCategories());
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };
  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  if(!user || user.roles !== 'ADMIN' ){
    return <h1>Error....</h1>
  }
  return (
    <>
      <Row className="mb-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              {...register("name", {
                required: "Name is required",
              })}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Add
          </Button>
        </Form>
      </Row>
      <Form onSubmit={handleDelete}>
        <Form.Group className="mb-3">
          <Form.Select aria-label="Default select example"  name="category">
            {categories.map((data)=>(
                   <option key={data.id} value={data.name}>{data.name}</option>
            ))}
          </Form.Select>
        </Form.Group>
        <Button variant="danger" type="submit">
          Delete
        </Button>
      </Form>
    </>
  );
}

export default AddCategory;
