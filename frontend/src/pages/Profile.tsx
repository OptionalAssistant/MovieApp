import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import ProfilerNav from "../components/ProfileNav";
import {
  useDeleteAvatarMutation,
  useFetchAuthMeQuery,
  useUpdateAvatarMutation,
} from "../redux/query";
import { Button } from "react-bootstrap";

function Profile() {
  const [avatarUrl, setImageUrl] = useState("");
  const { data: user, isLoading, error } = useFetchAuthMeQuery();
  const [updateAvatar] = useUpdateAvatarMutation();
  const [file, setFile] = useState<File | null>(null);

  const [deleteAvatar] = useDeleteAvatarMutation();

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const imageUrl = URL.createObjectURL(selectedFile);
      setImageUrl(imageUrl);
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      await updateAvatar(formData);
      alert("Avatar has changed!");
    }
  };
  useEffect(() => {
    if (user) setImageUrl(`http://localhost:4444/uploads/${user.avatar}`);
  }, [user]);
  return (
    <Container style={{ maxWidth: "600px", marginLeft: 0 }}>
      <h1>Profile Configurations</h1>
      <ProfilerNav />
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control value={user?.email || "Loading..."} disabled   style={{
          backgroundColor: "#433c4b",
          marginBottom:"10px"
        }}/>
        </Form.Group>

        <Form.Group controlId="formFile" className="mb-3">
          <Form.Label>Avatar</Form.Label>
          <Form.Control type="file" name="image" onChange={handleChangeFile} />
        </Form.Group>
        {avatarUrl && (
          <img
            src={avatarUrl}
            alt="Avatar preview"
            style={{
              width: "240px",
              height: "300px",
              display: "block",
              margin: "10px 0",
            }}
          />
        )}
        <Button variant="success" type="submit">
          Save
        </Button>
      </Form>

      <Button
        variant="danger"
        type="submit"
        style={{ margin: "10px 0" }}
        onClick={() => {
          deleteAvatar();
          alert("Avatar has succesfully deleted");
        }}
      >
        Delete
      </Button>
    </Container>
  );
}

export default Profile;
