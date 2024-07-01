import React from "react";
import { Container, Row, Col } from "reactstrap";
import "./WaypointCard.css";
import tt_services from "@tomtom-international/web-sdk-services";
import CachingImage from "../Helpers/CachingImage";
export default function WaypointCard({
  waypoint = {
    name: "testName",
    address: "testAdrress, 15",
    customer: {
      name: "testCustomer Name",
      e_Mail: "mailtest@example.com",
      tel_Number: "+380000000000",
    },
  },
  ...props
}) {
  const baseCardRowStyle = "m-0 p-0";
  return (
    <Container
      className="ms-0 m-1 me-2 bg-light p-4 container-fluid d-flex flex-column waypointCard rounded-2"
      style={{ height: "fit-content", width: "22rem" }}
      {...props}
    >
      <Row className="text-start pb-3">
        <span className="fw-bold">{waypoint.name}</span>
      </Row>

      <Row className="justify-content-center p-0 mt-1 ms-0 me-0">
        {/* <div
          className="bg-secondary"
          style={{ width: "100%", height: "13rem" }}
        ></div> */}
        <img
        className="p-0 "
          style={{ width: "100%", height: "13rem" }}
          src={
            'https://api.tomtom.com/map/1/staticimage?key='+
             process.env.REACT_APP_TOMTOM_API_KEY+
            '&width=500&height=280&zoom=17&center=' +
            waypoint.position.lon +
            "," +
            waypoint.position.lat
          }
        ></img>
      </Row>

      <Row className="m-0">
        <Col className="justify-content-evenly">
          <Row className="mb-0 pb-0">
            <h5 className="text-start ps-0">{waypoint.address}</h5>
          </Row>
          <Row className="mt-3 mb-3">
            <Col className="text-start p-0 pe-2 col-auto ">
              <span>Customer Name:</span>
            </Col>
            <Col className="text-end text-truncate text-black-50 pe-0">
              {waypoint.customer.name}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="text-start p-0 pe-2 col-auto">
              <span>Number:</span>
            </Col>
            <Col className="text-end text-truncate text-black-50 pe-0">
              {waypoint.customer.tel_Number}
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="text-start p-0 pe-2 col-auto">
              <span>E-Mail:</span>
            </Col>
            <Col className="text-end text-truncate text-black-50 pe-0">
              {waypoint.customer.e_Mail}
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
