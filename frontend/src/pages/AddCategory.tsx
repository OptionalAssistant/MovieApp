import { useEffect } from "react";
import { Button, Form, Row } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "../axios";
import { useAddCategoryMutation, useDeleteCategoryMutation, useFetchAuthMeQuery, useFetchCategoriesQuery } from "../redux/query";
import { ICategory } from "../types/typesRest";

function AddCategory(props: any) {


  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<ICategory>({ mode: "onChange" });

  const {data: categories,isError,isLoading,error} = useFetchCategoriesQuery();
  const {data: user} = useFetchAuthMeQuery();
  const [addCategory] = useAddCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const onSubmit: SubmitHandler<ICategory> = async (value: ICategory) => {
    console.log("Log value", value);
   await  addCategory(value);

  };


  const handleDelete = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const selectedCategory = event.currentTarget.elements.namedItem('category') as HTMLSelectElement;
    const value  : ICategory = { name: selectedCategory.value };
    try {
      deleteCategory(value);
      
      alert("Category removed");
   
    } catch (error) {
      console.error("Error deleting category", error);
    }
  };

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
            {categories && categories.map((data)=>(
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
