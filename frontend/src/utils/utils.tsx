import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import { IPaginationList } from "../types/typesClient";

export const constructPaginationList = (props: IPaginationList) => {
  const items = [];

  const prevIndex = Math.max(1, props.curPage - 4);
  const nextIndex = Math.min(props.pageCount, props.curPage + 4);

  for (let index = prevIndex; index < props.curPage; index++) {
    items.push(
      <Pagination.Item
        key={index}
        active={index === props.curPage}
        as={Link}
        to={`${props.link}${index}`}
      >
        {index}
      </Pagination.Item>
    );
  }

  for (let index = props.curPage; index <= nextIndex; index++) {
    items.push(
      <Pagination.Item
        key={index}
        active={index === props.curPage}
        as={Link}
        to={`${props.link}${index}`}
      >
        {index}
      </Pagination.Item>
    );
  }



  console.log("Cur page", props.curPage);
  console.log("Page count", props.pageCount);
  return (
    <Pagination>
      {props.curPage > 1 && (
        <Pagination.Prev>
          <Link to={`${props.link}${props.curPage - 1}`}>
            <span>Prev</span>
          </Link>
        </Pagination.Prev>
      )}
      {prevIndex > 1 && (
        <>
          <Pagination.Item
            key={1}
            active={props.pageCount === 1}
            as={Link}
            to={`${props.link}${1}`}
          >
            1
          </Pagination.Item>
          <Pagination.Ellipsis />{" "}
        </>
      )}
      {items}
      {nextIndex < props.pageCount && <Pagination.Ellipsis />}
      {nextIndex < props.pageCount && (
        <>
          <Pagination.Item
            key={props.pageCount}
            active={props.pageCount === props.curPage}
            as={Link}
            to={`${props.link}${props.pageCount}`}
          >
            {props.pageCount}
          </Pagination.Item>
        </>)}
      {props.curPage < props.pageCount && (
        <Pagination.Next>
          <Link to={`${props.link}${props.curPage + 1}`}>
            {" "}
            <span>Next</span>{" "}
          </Link>
        </Pagination.Next>
      )}
    </Pagination>
  );
};
