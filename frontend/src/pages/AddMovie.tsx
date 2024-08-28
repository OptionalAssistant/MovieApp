import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useEffect, useState } from "react";
import { FormGroup } from "react-bootstrap";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../axios";
import {
  useCreateMovieMutation,
  useEditMovieMutation,
  useFetchAuthMeQuery,
  useFetchCategoriesQuery,
} from "../redux/query";
import {
  IFullMovie,
  IMovieForm,
  IMovieForm2,
  IMovieModel,
} from "../types/typesRest";

function AddMovie(props: any) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<IMovieForm>({ mode: "onChange" });

  const { id } = useParams();
  const isEdit = Boolean(id);

  const {
    data: categories,
    isError,
    isLoading,
    error,
  } = useFetchCategoriesQuery();

  const [posterUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null); 

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const { data: user } = useFetchAuthMeQuery();

  const [editMovie] = useEditMovieMutation();
  const [createMovie] = useCreateMovieMutation();

  useEffect(() => {
    if (id) {
      axios
        .get<IFullMovie>(`/movies/full/${id}`)
        .then((data) => {
          const date = new Date(data.data.date);
          setValue("name", data.data.name);
          setValue("date.day", date.getDate());
          setValue("date.month", date.getMonth() + 1);
          setValue("date.year", date.getFullYear());
          setValue("country", data.data.country);
          setValue("trailerUrl", data.data.trailerUrl);
          setValue("description", data.data.description);
          setSelectedCategories([...data.data.categories]);
          setImageUrl(`http://localhost:4444/uploads/${data.data.imageUrl}`);
        })
        .catch((error) => {
          console.log("never error", error);
        });
    }
  }, [id, setValue]);

  const onSubmit: SubmitHandler<IMovieForm> = async (value: IMovieForm) => {
    value.categories = selectedCategories;
    const formData = new FormData();

    // Append file if it exists
    if (file) {
      formData.append("image", file);
    }
  
    // Append non-file fields to the FormData
    formData.append("name", value.name);
    formData.append("country", value.country);
    formData.append("trailerUrl", value.trailerUrl);
    formData.append("description", value.description);
  
    // Append date fields
    const { year, month, day } = value.date;
    const parsedDate = new Date(year, month - 1, day);
    formData.append("date", parsedDate.toISOString());
  
    // Append categories
    value.categories = selectedCategories; // Add selected categories to value
    formData.append("categories", JSON.stringify(selectedCategories)); // Send as a JSON string
  
    try {
      if (isEdit) {
        if (id) {
          formData.append("id", id.toString());
          await editMovie({ id, formData }).unwrap(); 
        }
  
        navigate(`/movies/${id}`);
      } else {
        const data = await createMovie(formData).unwrap(); // Use formData for creation
        navigate(`/movies/${data.id}`);
      }
    } catch (error) {
      console.log("Fail to submit movie form", error);
    }

  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageUrl(imageUrl);
      setFile(selectedFile);
    }
  };

  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    if (checked) {
      // Add the category to the selectedCategories array
      setSelectedCategories([...selectedCategories, name]);
    } else {
      // Remove the category from the selectedCategories array
      setSelectedCategories(
        selectedCategories.filter((category) => category !== name)
      );
    }
  };

  if (!user || user.roles !== "ADMIN") {
    return <h1>Error: Unauthorized access</h1>;
  }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Title</Form.Label>
        <Form.Control
          placeholder="Enter title..."
          {...register("name", {
            required: "Name is required",
          })}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </Form.Group>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Poster</Form.Label>
        <Form.Control type="file" name="image" onChange={handleChangeFile} />
      </Form.Group>
      {posterUrl && (
          <img
            src={posterUrl}
            alt="Avatar preview"
            style={{ width: "240px", height: "300px", display: "block" }}
          />
        )}
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Year</Form.Label>
        <Form.Control
          placeholder="Enter year..."
          {...register("date.year", {
            required: "Year is required",
          })}
        />
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Month</Form.Label>
        <Form.Control
          placeholder="Enter month..."
          {...register("date.month", {
            required: "Month is required",
            min: { value: 1, message: "Invalid month number" },
            max: { value: 12, message: "Invalid month number" },
          })}
        />
        {errors.date?.month?.message && (
          <span>{errors.date.month.message}</span>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Day</Form.Label>
        <Form.Control
          placeholder="Enter day..."
          {...register("date.day", {
            required: "Day is required",
            min: { value: 1, message: "Invalid day number" },
            max: { value: 31, message: "Invalid day number" },
          })}
        />
        {errors.date?.day?.message && (
          <span>{errors.date.day.message}</span>
        )}
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Country</Form.Label>
        <Form.Control
          placeholder="Enter country..."
          {...register("country", {
            required: "Country name is required",
          })}
        />
        {errors.country && <span>{errors.country.message}</span>}
      </Form.Group>
      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Trailer URL</Form.Label>
        <Form.Control
          placeholder="Enter trailer url"
          {...register("trailerUrl", {
            required: "Trailer URL is required",
          })}
        />
        {errors.trailerUrl && <span>{errors.trailerUrl.message}</span>}
      </Form.Group>
      {categories && (
        <FormGroup>
          {categories.map((data) => (
            <Form.Check
              inline
              label={data.name}
              name={data.name}
              type="checkbox"
              id={`inline-checkbox-${data.id}`} // Assuming `data.id` is unique for each item
              onChange={handleCheckboxChange}
              checked={selectedCategories.includes(data.name)} // Check if the name is in selectedCategories
            />
          ))}
        </FormGroup>
      )}
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          {...register("description", {
            required: "Description is required",
          })}
        />
        {errors.description && <span>{errors.description.message}</span>}
      </Form.Group>
      <Button variant="outline-dark" type="submit" className="mb-4">
        {isEdit ? "Save" : "Submit"}
      </Button>
    </Form>
  );
}

export default AddMovie;