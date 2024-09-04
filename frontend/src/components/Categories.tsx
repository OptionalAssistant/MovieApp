import { Link } from "react-router-dom";

import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import { useFetchCategoriesQuery } from "../redux/query";
import { capitalizeFirstLetter } from "../utils/utils";

function Categories() {
  const { data, isLoading, isError } = useFetchCategoriesQuery();

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
        <h3>Categories</h3>
        {!isLoading &&
          !isError &&
          data &&
          data.map((item) => (
            <Col
              key={item.id}
              xs={6} // 2 columns on extra small screens
              sm={4} // 3 columns on small screens
              md={3} // 4 columns on medium screens
              lg={2} // 6 columns on large screens
              className="mb-3" // Optional: margin bottom for spacing
            >
              <Link
                to={`categories/${item.name}/page/1`}
                className="text-decoration-none"
              >
                {capitalizeFirstLetter(item.name)}
              </Link>
              
            </Col>
          ))}
      </Row>
    </>
  );
}

export default Categories;
