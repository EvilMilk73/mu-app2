import { Container, Row, Col, Button, Collapse } from "reactstrap";
import React, { useState } from "react";
import { Draggable } from "react-beautiful-dnd";

export default function MapRouteCargoCard({ Cargo, index }) {
  const drawCard = () => {
    return (
      <Container name="CargoCard" className="border rounded pr-2 pt-1">
        {Cargo.name}
      </Container>
    );
  };
  return (
    <>
      <Draggable key={Cargo.id} draggableId={Cargo.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {drawCard()}
          </div>
        )}
      </Draggable>
    </>
  );
}
