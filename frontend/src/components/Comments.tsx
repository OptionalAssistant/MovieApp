import Button from "react-bootstrap/esm/Button";
import Col from "react-bootstrap/esm/Col";
import Form from "react-bootstrap/esm/Form";
import Row from "react-bootstrap/esm/Row";
import { SubmitHandler, useForm } from "react-hook-form";
import { useAddCommentMutation, useFetchCommentsQuery } from "../redux/query";
import { ErrorResponse } from "../types/typesClient";
import { IMovieComment, IMovieCommentId } from "../types/typesRest";
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

  const { data: comments, isLoading } = useFetchCommentsQuery(
    Number(props.id)
  );

  const [addComment] = useAddCommentMutation();

  const onSubmit: SubmitHandler<IMovieComment> = async (
    value: IMovieComment
  ) => {
    try{
      const  commId : IMovieCommentId = {id: props.id,comment : value};
      console.log("dsds",commId.comment );

      const data =  await  addComment(commId)
    }
      catch(error){
        const err = error as ErrorResponse;
        alert(err.response.data.message);
      };
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
            placeholder="Enter comment..."
            {...register("text", {
              required: "Comment cant be empty",
            })}
          />
          {errors.text && <span>{errors.text.message}</span>}
        </Form.Group>

        <Button type="submit">Send</Button>
      </Form>

      {!isLoading &&
        comments &&
        comments.map((data, idx) => {
          const formattedDate = new Date(data.createdAt).toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );
          console.log("Props", props.count);
          return (
            <Row key={idx} className="equal-height">
              <Col>
                <h3>{formattedDate}</h3>
                <h3>{data.name}</h3>
                <p>{data.text}</p>
                <img src={`http://localhost:4444/uploads/${data.avatar}`} alt="Poster" />
              </Col>
            </Row>
          );
        })}
    </>
  );
}

export default Comments;
