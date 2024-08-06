import Form from "react-bootstrap/esm/Form";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler } from "react-hook-form/dist/types/form";
import { useForm } from "react-hook-form";
import axios from "../axios";
import Button from "react-bootstrap/esm/Button";
import { useContext, useEffect } from "react";
import Context from '../context/context'
import { useNavigate } from "react-router-dom";
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

  const {state,dispatch}= useContext(Context);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>({ mode: "onChange" });
  const navigate = useNavigate();
  const onSubmit: SubmitHandler<IFormInput> = async (value) => {

      console.log(value);
        axios.post("/auth/register", value)
        .then(data =>{
          navigate("/");
          console.log("Sending data to store");
          console.log(data);
          dispatch({type: 'fullfilled',payload: data});

          console.log("token on client state(регистрация)",data.data.token);
          window.localStorage.setItem('token',data.data.token);
        })
        .catch(err =>{
          console.log("Erroro")
          console.log(err);
          dispatch({type: 'rejected',payload: null});
        });
    
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
