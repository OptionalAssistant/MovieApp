import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link, useNavigate } from "react-router-dom";

import { useFetchCategoriesQuery } from "../redux/query";
import { capitalizeFirstLetter } from "../utils/utils";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";

function Sorting() {
  const { data, isLoading, isError } = useFetchCategoriesQuery();

  const dropdownItems = [
    { navigate: "new-movies", name: "Most recent" },
    { navigate: "most-likes", name: "Most liked" },
    { navigate: "popular", name: "Most popular" },
  ];
  return (
    <>
      <Row
        style={{
          backgroundColor: "#433c4b",
          padding: "20px",
          borderRadius: "5px",
          height: '100%', // Ensures full height
        }}
      >
        <h3 style={{ color: "white" }}>Sorting</h3>
        {!isLoading &&
          !isError &&
          data &&
          dropdownItems.map((item) => (
            <Col
              key={item.name}
              xs={6} // 2 columns on extra small screens
              sm={4} // 3 columns on small screens
              md={3} // 4 columns on medium screens
              lg={2} // 6 columns on large screens
              className="mb-3" // Optional: margin bottom for spacing
            >
              <Link
                to={`${item.navigate}/1`}
                className="text-decoration-none"
                style={{ color: "white" }} // Ensure closing bracket is present
              >
                {capitalizeFirstLetter(item.name)}
              </Link>
              
            </Col>
          ))}
      </Row>
    </>
  );
}

export default Sorting;
