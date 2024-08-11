import Form from "react-bootstrap/esm/Form";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler } from "react-hook-form/dist/types/form";
import { useForm } from "react-hook-form";
import axios from "../axios";
import Button from "react-bootstrap/esm/Button";
import { useNavigate } from "react-router-dom";

interface IFormInput {
  email: string;
}
function PassRecovery(props: any) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ mode: "onChange" });
  const onSubmit: SubmitHandler<IFormInput> = async (value) => {

    axios
      .post("/forgot-password", value)
      .then(() => {
        alert("Check your email");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <h1>Pass Recovery</h1>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email..."
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && <span>{errors.email.message}</span>}
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
}

export default PassRecovery;
