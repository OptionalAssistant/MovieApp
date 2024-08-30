import React, { useEffect, useState } from "react";
import Alert from "react-bootstrap/esm/Alert";
import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import DropdownCategories from "../components/Categories";

import Dropdown from "react-bootstrap/esm/Dropdown";
import DropdownButton from "react-bootstrap/esm/DropdownButton";
import { useFetchAuthMeQuery, useLogoutMutation } from "../redux/query";
import { IMovieSearchForm } from "../types/typesRest";
import Canvas from "./Canvas";
import ModalWindow from "./Login";
import SearchComponent from "./SearchComponent";

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
    navigate(`/search/?name=${value.name}`);
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
      <Row className="mt-4">
        <Col lg={3} className="mb-3 btn-md">
          <Link to="/">
            <Button variant="primary">Home</Button>
          </Link>
        </Col>
        <SearchComponent/>
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
        <Col><Button variant="outline-primary" onClick={()=>navigate("/persons")}>Actors</Button></Col>
        <Col lg={3}>{button}</Col>
        {user && !isError && !isLoading && (
          <Col>
            {" "}
            <Button
              variant="outline-warning btn btn-primary btn-md"
              type="submit" onClick={()=> navigate('/profile')}
            >
              Profile
            </Button>
          </Col>
        )}
        <Col>
          {user && user.isActivated && user.roles === "ADMIN"&& !isError && (
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
            <Dropdown.Item onClick={() => navigate("/new-movies/1")}>
              Most recent
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/most-likes/1")}>
              Most liked
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate("/popular/1")}>
              Most popular
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      {window.localStorage.getItem("token") && user  && !user.isActivated && (
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
