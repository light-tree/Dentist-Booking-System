import { Pagination, PaginationItem, PaginationLink } from "reactstrap";

const CustomPagination = ({ itemsPerPage, totalItems, paginate }) => {
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <Pagination className="d-flex justify-content-center">
        <PaginationItem>
          <PaginationLink href="#">
            <span aria-hidden="true">
              <i className="fa fa-angle-double-left" aria-hidden="true" />
            </span>
          </PaginationLink>
        </PaginationItem>
        {pageNumbers.map((number) => (
          <PaginationItem key={number} active>
            <PaginationLink onClick={() => paginate(number)} href="#">
              {number}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationLink href="#">
            <span aria-hidden="true">
              <i className="fa fa-angle-double-right" aria-hidden="true" />
            </span>
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </nav>
  );
};

export default CustomPagination;
