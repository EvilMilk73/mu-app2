import { Container, Row, Col, Button, Collapse } from "reactstrap";
import React, { useState } from "react";

export default function TestComponent() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);
  return (
    <>
      <Container>
        <Container
          name="RouteCard"
          className="border rounded pr-2 pt-1"
          style={{ width: "50%" }}
        >
          <Row>
            <div className="h6 mb-1">Маршрут №51</div>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col className="col-auto">Час відбуття:</Col>
                <Col>15:55</Col>
              </Row>
              <Row>
                <Col className="col-auto">Час прибуття:</Col>
                <Col>18:35</Col>
              </Row>
            </Col>
            <Col>
              <Container className="text-center pb-3">
                <img
                  src="https://via.placeholder.com/150x150"
                  className="img-fluid"
                ></img>
              </Container>
            </Col>
          </Row>
        </Container>
      </Container>
    </>
  );
}
