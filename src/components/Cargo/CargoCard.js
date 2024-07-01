import { Container, Row, Col, Button, Collapse } from "reactstrap";
import React, { useState } from "react";
import "./CargoCard.css";
import { Box } from "react-bootstrap-icons";

export default function CargoCard({ Cargo, onClick }) {
  const drawCard = () => {
    return (
      <Container
        onClick={onClick}
        name="CargoCard"
        className="border rounded-3 m-1 ps-2 pt-2 pe-3 pb-2 bg-secondary  "
      > 
        
        <Row className=" pb-1">
          <Col className="">{Cargo.waypoint.customer.name}</Col>
          <Col className="align-self-end col-auto">{Cargo.date}</Col>
        </Row>
        <Row className=" pb-1">
          <small className="text-muted">{Cargo.waypoint.name}</small>
        </Row>
        <Row className="">
          <Col className="">Детальніше</Col>
          <Col className="align-self-end col-auto">
            <Row className="">
              <Col className="col-auto pe-1">{Cargo.weight + " кг"}</Col>
              <Col className="col-auto ps-1">
                <Box ></Box>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  };
  return <>{drawCard()}</>;
}
