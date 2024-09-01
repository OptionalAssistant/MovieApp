import React from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";

import Categories from "../components/Categories";
import { useFetchAuthMeQuery, useLogoutMutation } from "../redux/query";
import { IMovieSearchForm } from "../types/typesRest";
import Canvas from "./Canvas";
import ModalWindow from "./Login";
import Sorting from "./Sorting";

function Header() {
  const [modalShow, setModalShow] = React.useState<boolean>(false);

  const { data: user, isLoading, isError } = useFetchAuthMeQuery();

  const [logout] = useLogoutMutation();

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
        alert(`Check email. Message sending to email: ${user?.email}`);
      })
      .catch((err) => {
        console.log(err);
        alert(`Ooops. Message dont sending to email: ${user?.email}`);
      });
  };
  const onSubmit: SubmitHandler<IMovieSearchForm> = async (
    value: IMovieSearchForm
  ) => {
    navigate(`/search/main/?name=${value.name}`);
  };
  if (user && !isError && !isLoading) {
    button = (
      <Button
        variant="danger"
        onClick={() => {
          window.localStorage.removeItem("token");
          logout();
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
      <Row className="mt-4 mb-4">
        <Col lg={3} className="btn-md">
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
              style={{maxWidth:"200px"}}
            />
            <Button
              variant="outline-success btn btn-primary btn-md"
              type="submit"
            >
              Search
            </Button>
          </Form>
        </Col>
        <Col>
          <Button
            variant="outline-primary"
            onClick={() => navigate("/persons")}
          >
            Actors
          </Button>
        </Col>
        <Col lg={3}>{button}</Col>
        {user && !isError && !isLoading && (
          <Col>
            {" "}
            <Button
              variant="outline-warning btn btn-primary btn-md"
              type="submit"
              onClick={() => navigate("/profile")}
            >
              Profile
            </Button>
          </Col>
        )}
        <Col>
          {user && user.isActivated && user.roles === "ADMIN" && !isError && (
            <Canvas
              variant="outline-danger"
              placement={"end"}
              name={"admin panel"}
            ></Canvas>
          )}
        </Col>
      </Row>
      <Row className="g-3"> {/* g-3 for gutters to ensure spacing between columns */}
  <Col xs={12} md={6} className="mb-3 mt-2 pe-md-3 ps-md-3">
    <Categories />
  </Col>
  <Col xs={12} md={6} className="mb-3 mt-2 pe-md-3 ps-md-3">
    <Sorting />
  </Col>
</Row>
      {window.localStorage.getItem("token") && user && !user.isActivated && (
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
