import React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import DropdownCategories from "../components/Categories";

import { logout } from "../redux/slices/auth";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { IMovieSearchForm } from "../types/typesRest";
import ModalWindow from "./Login";
import Canvas from "./Canvas";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import Dropdown from "react-bootstrap/esm/Dropdown";

function Header() {
  const [modalShow, setModalShow] = React.useState<boolean>(false);
  const email = useAppSelector((state) => state.auth.user?.email);
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const isActivated = useAppSelector((state) => state.auth.user?.isActivated);
  const role = useAppSelector((state) => state.auth.user?.roles);
  console.log(user, isActivated, role);
  const dispatch = useAppDispatch();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IMovieSearchForm>({ mode: "onSubmit" });

  let button;
  const navigate = useNavigate();
  const verifyEmail = async () => {
    axios
      .post("/activate")
      .then((data) => {
        console.log(data.data);
        alert(`Check email. Message sending to email: ${email}`);
      })
      .catch((err) => {
        console.log(err);
        alert(`Ooops. Message dont sending to email: ${email}`);
      });
  };
  const onSubmit: SubmitHandler<IMovieSearchForm> = async (
    value: IMovieSearchForm
  ) => {
    navigate(`/search/?name=${value.name}`);
  };
  if (user && !loading) {
    button = (
      <Button
        variant="danger"
        onClick={() => {
          window.localStorage.removeItem("token");
          dispatch(logout());
        }}
      >
        Logout
      </Button>
    );
  } else {
    button = (
      <Button
        variant="primary"
        type="button"
        onClick={() => setModalShow(true)}
      >
        Login
      </Button>
    );
  }

  return (
    <>
      <Row className="mt-4">
        <Col lg={3} className="mb-3 btn-md">
          <Link to="/">
            <Button variant="primary">Home</Button>
          </Link>
        </Col>
        <Col lg={3}>
          <Form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
            <Form.Control
              type="search"
              placeholder="Enter movie name"
              className="me-2"
              aria-label="Search"
              {...register("name", {
                required: "Movie name is required",
              })}
            />
            <Button
              variant="outline-success btn btn-primary btn-md"
              type="submit"
            >
              Search
            </Button>
          </Form>
        </Col>
        <Col lg={3}>{button}</Col>
        <Col>
          {/* <Button variant="outline-danger">Admin panel</Button> */}
          {user && isActivated && role === "ADMIN" && (
            <Canvas
              variant="outline-danger"
              placement={"end"}
              name={"admin panel"}
            ></Canvas>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
        {""}
        <DropdownCategories />
        </Col>
        <Col>
        <DropdownButton id="dropdown-basic-button" title="Sorting">
        <Dropdown.Item    onClick={() => navigate('/new-movies/1')}>
            Most recent
        </Dropdown.Item>
        <Dropdown.Item   onClick={() => navigate('/popular/1')}>
            Most popular
        </Dropdown.Item>
        </DropdownButton>
        </Col>
   
      </Row>
      {user && !isActivated && (
        <Alert variant="danger">
          <Alert.Heading>Ooops your email is not verified</Alert.Heading>
          <p>Verify your email click on the burron below</p>
          <Button variant="danger" onClick={verifyEmail}>
            Verify email
          </Button>
        </Alert>
      )}

      <ModalWindow show={modalShow} hide={() => setModalShow(false)} />

   
    </>
  );
}

export default Header;
