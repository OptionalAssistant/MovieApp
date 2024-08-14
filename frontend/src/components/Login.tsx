import { useContext } from "react";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Modal from "react-bootstrap/esm/Modal";
import Row from "react-bootstrap/esm/Row";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form/dist/types/form";
import { useNavigate } from "react-router-dom";
import axios from "../axios";
import Context from "../context/contextUser";
import { ErrorResponse } from "../types/typesClient";
import { ILoginForm, UserDataToken } from "../types/typesRest";

interface ModalProps {
  show: boolean;
  hide: () => void;
}

interface IFormInput {
  email: string;
  password: string;
}
function ModalLogin(props: ModalProps) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IFormInput>({ mode: "onChange" });

  const { state, dispatch } = useContext(Context);


  const onSubmit: SubmitHandler<IFormInput> = async (value: ILoginForm) => {
    axios
      .post<UserDataToken>("/auth/login", value)
      .then(({ data }) => {
        props.hide();
        dispatch({ type: "fullfilled", payload: data.data });
        console.log('data ',data);
        window.localStorage.setItem("token", data.token);
      })
      .catch((err : ErrorResponse) => {
        setError("password", { type: "custom", message: err.response.data.message });

        // alert("Invalid login or password");
        dispatch({ type: "rejected", payload: null });
      });
  };

  const navigate = useNavigate();

  const handleclick = () => {
    props.hide();
    navigate("/auth/register");
  };
  const forgetPassword = () => {
    props.hide();
    navigate("/reset-password");
  };
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              // type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password is too short",
                },
              })}
            />
            {errors.password && <p>{errors.password.message}</p>}
          </Form.Group>

          <Row className="justify-content-between mb-3">
            <Col className="col-sm-auto">
              <Button variant="primary" type="submit">
                Login
              </Button>
            </Col>
          </Row>
        </Form>
        <Row className="d-flex justify-content-between">
          <Col className="col-md-auto">
            <Button
              className="btn btn-info"
              role="button"
              type="button"
              onClick={handleclick}
            >
              Regitser
            </Button>
          </Col>
          <Col className="col-md-auto">
            <Button variant="primary" type="button" onClick={forgetPassword}>
              Forget password
            </Button>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.hide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalLogin;
