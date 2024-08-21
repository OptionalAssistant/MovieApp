import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";

import { IFullMovie, IMovieForm, IMovieForm2, IMovieModel } from "../types/typesRest";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "../axios";
import { useEffect, useState } from "react";
import { fetchCategories } from "../redux/slices/category";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { Alert, FormGroup } from "react-bootstrap";
import { ErrorResponse } from "../types/typesClient";
import { useNavigate, useParams } from "react-router-dom";
import { isEditable } from "@testing-library/user-event/dist/utils";
import movie from "../redux/slices/movie";

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

  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.categories);
  const [imageUrl, setImageUrl] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (id) {
      axios
        .get<IFullMovie>(`/movies/full/${id}`)
        .then((data) => {
          const date = new Date(data.data.date);
          setValue("name", data.data.name);
          setValue("date.day",date.getDate());
          setValue("date.month",date.getMonth() + 1);
          setValue("date.year",date.getFullYear());
          setValue("country", data.data.country);
          setValue("trailerUrl", data.data.trailerUrl);
          setValue("description", data.data.description);
          setImageUrl(data.data.imageUrl);
          console.log("caaa",[...data.data.categories]);
          setSelectedCategories([...data.data.categories]);
        })
        .catch((error) => {
          console.log("never error", error);
        });
    }
  },[]);
  const onSubmit: SubmitHandler<IMovieForm> = async (value: IMovieForm) => {
    value.imageUrl = imageUrl;
    value.categories = selectedCategories;


    const { year, month, day } = value.date;
    const parsedDate = new Date(year, month - 1, day); // month - 1 since Date() expects a zero-based month
    const movieForm: IMovieForm2 = {
      ...value,
      date: parsedDate,
    };
    console.log("Movie form",movieForm);
    if (isEdit) {
      axios
        .put(`/movies/edit/${id}`, movieForm)
        .then((data) => {
          console.log("Movie updated!");
          navigate(`/movies/${id}`);
        })
        .catch(() => console.log("Failed to update movie"));
    } else {
      axios
        .post<IMovieModel>("movie/create", movieForm)
        .then((data) => {
          console.log("Succeded", data.data);

          alert("Movie was added");
          navigate(`/movies/${data.data.id}`);
        })
        .catch((err) => alert("Something went wrong"));
    }
  };

  useEffect(() => {
    dispatch(fetchCategories());
  }, []);

  const handleChangeFile = async (event: any) => {
    try {
      if (imageUrl) {
        console.log("image alrady was loaded.delete it\n");
        axios.delete(`/image/delete/${imageUrl}`);
        setImageUrl("");
      }
      const formData = new FormData();

      formData.append("image", event.target.files[0]);

      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
    } catch (err) {
      console.log(err);
      alert("Ошибка при загрузке файла!");
    }
  };
  const handleCheckboxChange = (event: any) => {
    const { name, checked } = event.target;
    console.log("name", selectedCategories);
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
    return <h1>Error....</h1>;
  }

  return (
    <>
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
          <Form.Control type="file" onChange={handleChangeFile} />
        </Form.Group>
        {imageUrl && (
          <img src={`http://localhost:4444/uploads/${imageUrl}`}></img>
        )}
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Year</Form.Label>
          <Form.Control
            placeholder="Enter date..."
            {...register("date.year", {
              required: "Year is required",
            })}
          />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Label>Month</Form.Label>
          {errors.date && <span>{errors.date.message}</span>}
          <Form.Control
            placeholder="Enter date..."
            {...register("date.month", {
              required: "Month is required",
              min: {value: 1,message:"Invalid month number"},max:{value: 12,message:"Invalid math number"}
            })}
          />
        {errors.date?.month?.message && <span>{errors.date.month.message}</span>}
        </Form.Group>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
        <Form.Label>Day</Form.Label>
        <Form.Control
            placeholder="Enter date..."
            {...register("date.day", {
              required: "Day is required",
              min: {value: 1,message:"Invalid day number"},max:{value: 31,message:"Invalid day number"}
            })}
          />
        {errors.date?.day?.message && <span>{errors.date.day.message}</span>}

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
                checked={selectedCategories.includes(data.name)} // Check if the ID is in selectedCategories
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
    </>
  );
}

export default AddMovie;
