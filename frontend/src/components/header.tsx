import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import ModalWindow from "./Login";
import React, { useContext } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Context from "../context/contextUser";
import Alert from "react-bootstrap/esm/Alert";
import axios from "../axios";
import { IMovieSearchForm } from "../types/typesRest";
import { useForm } from "react-hook-form";
import { SubmitHandler } from "react-hook-form";
import DropdownCategories from '../components/Categories';
import IMovieStore from "../context/contextMovie";

function Header() {
  const [modalShow, setModalShow] = React.useState<boolean>(false);
  const { state, dispatch } = useContext(Context);
  const movieContext = useContext(IMovieStore);

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
        alert(`Check email. Message sending to email: ${state.user}`);
      })
      .catch((err) => {
        console.log(err);
        alert(`Ooops. Message dont sending to email: ${state.user}`);
      });
  };
  const onSubmit: SubmitHandler<IMovieSearchForm> = async (
    value: IMovieSearchForm
  ) => {
    //  const params = new URLSearchParams(value as unknown as Record<string,string>);
    //  const queryString = params.toString();
    console.log("submit value");
    navigate(`/search/?name=${value.name}`);
  };
  if (state.user && state.loading === false) {
    button = (
      <Button
        variant="danger"
        onClick={() => {
          window.localStorage.removeItem("token");
          dispatch({ type: "set", payload: null });
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
      </Row>
      <Row>
        {""}
        <DropdownCategories />
      </Row>
      {state.user && !state.user.isActivated && (
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
