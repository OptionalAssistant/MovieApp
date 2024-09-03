import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAddCommentMutation, useFetchCommentsQuery } from "../redux/query";
import { ServerError } from "../types/typesClient";
import { IMovieComment, IMovieCommentId } from "../types/typesRest";
import Image from "react-bootstrap/Image";

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

  const { data: comments, isLoading ,isError} = useFetchCommentsQuery(Number(props.id));

  const [addComment] = useAddCommentMutation();

  const onSubmit: SubmitHandler<IMovieComment> = async (
    value: IMovieComment
  ) => {
    try {
      const commId: IMovieCommentId = { id: props.id, comment: value };
       const response =  await addComment(commId).unwrap();
       console.log("response",response);
    } catch (error) {
      console.log("Error",error);
      const err = error as ServerError;
      alert(err.data.message);
    }
  };
  return (
    <>
      <h3>Комментарии : {props.count}</h3>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Write comment</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
              className="me-2 form-control"
            placeholder="Enter comment..."
            {...register("text", {
              required: "Comment cant be empty",
            })}
          />
          {errors.text && <span>{errors.text.message}</span>}
        </Form.Group>

        <Button         variant="dark button-outline btn btn-primary btn-md" type="submit">Send</Button>
      </Form>
      {!isLoading && 
        comments && !isError&&
        comments.map((data, idx) => {
          const formattedDate = new Date(data.createdAt).toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
          return (
              <div key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: "row",
                }}
                className="equal-height mt-3"
              >
                <Image
                  src={data.avatar ?`http://localhost:4444/uploads/${data.avatar}` : `http://localhost:4444/uploads/default.jpg`}
                  alt="Poster"
                  roundedCircle
                  width="60px"
                  height="60px"
                  style={{ display: "inline-block" }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "10px"
                  }}
                >
                  <p style={{ fontWeight: "bold" }}>
                    {data.name} {formattedDate}{" "}
                  </p>

                  <p style={{ marginTop: "-10px" }}>{data.text} </p>
                </div>
              </div>
          );
        })}
    </>
  );
}

export default Comments;
