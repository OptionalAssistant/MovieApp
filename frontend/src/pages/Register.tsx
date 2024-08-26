import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types/form";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../redux/query";
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
    setError,
    formState: { errors },
  } = useForm<IFormInput>({ mode: "onChange" });
  const navigate = useNavigate();
  
  const [regiterUser] = useRegisterMutation();
  
  const onSubmit: SubmitHandler<IFormInput> = async (value: IFormInput) => {
    console.log(value);
    try {
      const resultAction = await regiterUser(value).unwrap();

      window.localStorage.setItem('token',resultAction.token);
      navigate('/');
    } catch (error) {
      setError("password", { type: "custom", message: error as string});
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
        <Form.Control
          type="password"
          placeholder="Password..."
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password is too short",
            },
          })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default Register;
