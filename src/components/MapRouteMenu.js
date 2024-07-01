import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { Container, Row, Col, Button, Collapse } from "reactstrap";
import React, { useState } from "react";
import MapRouteCargoCard from "./MapRouteCargoCard";
let initialData = [
  {
    name: "TestName",
    adress: "TestAdress",
    date: "01.02.2001",
    id: "0",
  },
  {
    name: "TestName2",
    adress: "TestAdress2",
    date: "01.02.2001",
    id: "1",
  },
  {
    name: "TestName3",
    adress: "TestAdress3",
    date: "01.02.2001",
    id: "2",
  },
];
export default function MapRouteMenu() {
  const [Cargoes, setCargoes] = useState(initialData);

  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    // Create a new array with the updated order
    const reorderedData = Object.values(Cargoes).map((item) => ({ ...item }));
    const [movedItem] = reorderedData.splice(sourceIndex, 1);
    reorderedData.splice(destinationIndex, 0, movedItem);

    // Update state with the new order
    setCargoes(reorderedData);
  };
  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="1" index={0}>
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {Object.values(Cargoes).map((item, index) => (
                <MapRouteCargoCard Cargo={item} index={index} key={item.id} />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
}
