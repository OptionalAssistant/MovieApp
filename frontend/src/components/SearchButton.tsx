    import { Button, Form } from "react-bootstrap";
    import { IMovieSearchForm } from "../types/typesRest";
    import { SubmitHandler, useForm } from "react-hook-form";
    import { useNavigate } from "react-router-dom";

    interface IFormInfo {
    placeholder: string;
    navigationLink: string;
    }
    function SearchButton(props: IFormInfo) {
    const navigate = useNavigate();

    const onSubmit: SubmitHandler<IMovieSearchForm> = async (
        value: IMovieSearchForm
    ) => {
        navigate(`${props.navigationLink}${value.name}`);
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<IMovieSearchForm>({ mode: "onSubmit" });

    return (
        <Form className="d-flex mb-3" onSubmit={handleSubmit(onSubmit)}>
        <Form.Control
            type="search"
            placeholder={props.placeholder}
                 className="me-2 form-control"
            aria-label="Search"
            {...register("name", {
            required: "Actor name is required",
            })}
            style={{ maxWidth: "500px" ,backgroundColor: "dark"}}
        />
        <Button variant="dark button-outline btn btn-primary btn-md" type="submit">
            Search
        </Button>
        </Form>
    );
    }

    export default SearchButton;
