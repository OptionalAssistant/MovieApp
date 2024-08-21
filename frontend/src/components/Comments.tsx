import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import { IMovieComment } from "../types/typesRest";
import { SubmitHandler, useForm } from "react-hook-form";
import axios from "../axios";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchComments } from "../redux/slices/comments";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { ErrorResponse } from "../types/typesClient";

interface movieId {
  id: string | undefined;
  count: number;
}
function Comments(props: movieId) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IMovieComment>({ mode: "onSubmit" });

  const dispatch = useAppDispatch();
  const comments = useAppSelector((state) => state.comments);
  console.log(props.count);
  const onSubmit: SubmitHandler<IMovieComment> = async (
    value: IMovieComment
  ) => {
    axios
      .post(`/add-comment/${props.id}`, value)
      .then(() => {
        console.log("Movie was sucessfully added\n");
        dispatch(fetchComments(`get-comments/${props.id}`));
      })
      .catch((error) => {
        const err = error as ErrorResponse;
        alert(err.response.data.message);
        
      });
  };

  useEffect(() => {
    dispatch(fetchComments(`get-comments/${props.id}`));
  }, []);
  return (
    <>
      <h3>Комментарии : {props.count}</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Write comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            placeholder="Enter comment..."
            {...register("text", {
              required: "Comment cant be empty",
            })}
          />
          {errors.text && <span>{errors.text.message}</span>}
        </Form.Group>

        <Button type="submit">Send</Button>
      </Form>

      {!comments.loading &&
  comments.comments &&
  comments.comments.map((data, idx) => {
    const formattedDate = new Date(data.createdAt).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    console.log("Props",props.count)
    return (
      <Row key={idx} className="equal-height">
        <Col>
          <h3>{formattedDate}</h3>
          <h3>{data.name}</h3>
          <p>{data.text}</p>
        </Col>
      </Row>
    );
  })}
    </>
  );
}

export default Comments;
