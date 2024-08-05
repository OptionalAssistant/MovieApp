import Form from "react-bootstrap/esm/Form";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler } from "react-hook-form/dist/types/form";
import { useForm } from "react-hook-form";
import axios from "../axios";
import Button from "react-bootstrap/esm/Button";

interface ModalProps {
  show: boolean;
  hide: () => void;
}

interface IFormInput {
  name: string;
  email: string;
  password: string;
}
function Register(props: any) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ mode: "onChange" });
  const onSubmit: SubmitHandler<IFormInput> = async (value) => {
    try {
      console.log(value);
      const { data } = await axios.post("/auth/register", value);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Name</Form.Label>
        <Form.Control
          placeholder="Enter name...."
          {...register("name", {
            required: "Name is required",
            minLength: { value: 2, message: "Name too short" },
          })}
        />
        {errors.name && <span>{errors.name.message}</span>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email..."
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password..."
        {...register('password',{required :'Password is required',
          minLength: {
            value : 8,
            message: 'Password is too short'
          }
        })} />
          {errors.password && <span>{errors.password.message}</span>}
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default Register;
