import React, { useEffect, useState } from "react";
import { Button, InputGroup } from "reactstrap";

export default function TablePagination({
  totalPages,
  currentPage,
  setCurrentPage,
}) {
  const [paginationLayout, setPaginationLayout] = useState([]);
  let paginationSize = 7;
  useEffect(() => {
    setPaginationLayout(createPaginationLayout());
  }, [currentPage, totalPages]);

  const createPaginationLayout = () => {
    if (totalPages <= paginationSize) {
      let arr = Array.from(Array(totalPages + 1).keys());
      arr.shift();
      return arr;
    }
    if (currentPage <= paginationSize - 3) {
      let arr = Array.from(Array(paginationSize - 1).keys());
      arr.shift();
      arr.push(0);
      arr.push(totalPages);
      return arr;
    }
    if (currentPage >= totalPages - (paginationSize - 4)) {
      let arr = [];
      arr.push(1);
      arr.push(0);
      for (let i = totalPages - (paginationSize - 3); i < totalPages; i++) {
        arr.push(i);
      }
      arr.push(totalPages);
      return arr;
    }
    const elementsToSide = Math.floor((paginationSize - 4) / 2);
    let Value = currentPage - elementsToSide;
    let arr = [];
    arr.push(1);
    arr.push(0);
    for (let i = 0; i < paginationSize - 4; i++, Value++) {
      arr.push(Value);
    }
    arr.push(0);
    arr.push(totalPages);
    return arr;
  };
  const nextClickHandle = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevClickHandle = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleOtherButton = (index) => {
    console.log(index, paginationLayout);
    if (index === 1) {
      //left button
      let targetPage = paginationLayout[index + 1] - 1;
      setCurrentPage(targetPage);
    } else {
      if (index === paginationLayout.length - 2) {
        // rightbutton
        let targetPage = paginationLayout[index - 1] + 1;
        setCurrentPage(targetPage);
        
      }
    }
  };
  let buttonClass = "border-1 bg-transparent text-primary";
  return (
    <>
      <InputGroup>
        <Button className={buttonClass} onClick={prevClickHandle}>
          Prev
        </Button>
        {paginationLayout.map((item, index) =>
          item === 0 ? (
            <Button
              key={index}
              className={buttonClass}
              onClick={() => handleOtherButton(index)}
            >
              ...
            </Button>
          ) : (
            <Button
              key={index}
              className={
                currentPage === item
                  ? "border-1 bg-primary text-white"
                  : buttonClass
              }
              style={{ width: "2.7rem" }}
              onClick={() => setCurrentPage(item)}
            >
              {item}
            </Button>
          )
        )}
        <Button className={buttonClass} onClick={nextClickHandle}>
          Next
        </Button>
      </InputGroup>
    </>
  );
}
