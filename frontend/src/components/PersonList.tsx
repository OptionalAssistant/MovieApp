import Row from "react-bootstrap/esm/Row";
import { IPerson } from "../types/typesRest";
import Person from "./Person";
import Col from "react-bootstrap/esm/Col";


  interface PersonListProps {
    persons: IPerson[];
  } 

function PersonList({ persons }: PersonListProps){
    return(
        <>
        {!persons.length ? (
          <h1>None</h1>
        ) : (
          <Row xs={1} md={3} className="g-4 mb-3 card-fixed">
            {persons.map((data, idx) => (
              <Col key={idx} className="equal-height">
                <Person person={data} />
              </Col>
            ))}
          </Row>
        )}
      </>
    );
}

export default PersonList;