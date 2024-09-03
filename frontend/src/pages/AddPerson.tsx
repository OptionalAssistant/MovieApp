import { useForm } from "react-hook-form";
import { IFullPerson, IPersonForm, IPersonFull } from "../types/typesRest";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCreatePersonMutation, useEditMovieMutation, useEditPersonMutation } from "../redux/query";
import axios from "../axios";

function AddPerson(props: any) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<IPersonForm>({ mode: "onChange" });

  const { id } = useParams();
  const isEdit = Boolean(id);
  
  const [posterUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [createPerson] = useCreatePersonMutation();
  const [editPerson] = useEditPersonMutation();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      axios
        .get<IFullPerson>(`/persons/full/${id}`)
        .then((data) => {
          const date = new Date(data.data.date);
          setValue("name", data.data.name);
          setValue("date.day", date.getDate());
          setValue("date.month", date.getMonth() + 1);
          setValue("date.year", date.getFullYear());
          setValue("birthplace",data.data.birthplace);
          setValue("tall",data.data.tall);

          setImageUrl(`http://localhost:4444/uploads/${data.data.avatarUrl}`);
        })
        .catch((error) => {
          console.log("never error", error);
        });
    }
  }, [id, setValue]);

  const onSubmit =  async(data: IPersonForm) => {
    const formData = new FormData();

    if (file) {
      formData.append("image", file);
    }

    formData.append("name", data.name);
    formData.append("birthplace", data.birthplace);
    formData.append("tall", data.tall);

    // Append date fields
    const { year, month, day } = data.date;
    const parsedDate = new Date(year, month - 1, day);
    formData.append("date", parsedDate.toISOString());

    try {
        if (isEdit) {
          if (id) {
            formData.append("id", id.toString());
            await editPerson({ id, formData }).unwrap(); 
          }
    
          navigate(`/persons/${id}`);
        } else {
          const data = await createPerson(formData).unwrap(); // Use formData for creation
          navigate(`/persons/${data.id}`);
        }
      } catch (error) {
        console.log("Fail to submit movie form", error);
      }

    console.log(data);
  };

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageUrl(imageUrl);
      setFile(selectedFile);
    }
  };

  return (
    <>
      <h1>Add person</h1>
      <Row className="mb-4">
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              {...register("name", {
                required: "Name is required",
              })}
            />
            {errors.name && <span>{errors.name.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Birthplace</Form.Label>
            <Form.Control
              {...register("birthplace", {
                required: "Birthplace is required",
              })}
            />
            {errors.tall && <span>{errors.tall.message}</span>}
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Height</Form.Label>
            <Form.Control
              {...register("tall", {
                required: "Height is required",
              })}
            />
            {errors.tall && <span>{errors.tall.message}</span>}
          </Form.Group>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label>Poster</Form.Label>
            <Form.Control
              type="file"
              name="image"
              onChange={handleChangeFile}
            />
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
            {errors.date?.year?.message && (
              <span>{errors.date.year.message}</span>
            )}
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
          <Button variant="success" type="submit">
            Add
          </Button>
        </Form>
      </Row>
    </>
  );
}

export default AddPerson;
