import React from "react";
import { Col, Row} from "reactstrap";
import { Icon } from "@iconify/react";
export default function ContentHeader(){
    return(
        <header className="ps-0 pe-0 pt-3 border-bottom border-menu-bg border-2" style={{height: '10vh', minHeight:'70px'}}>
        <Row className="justify-content-between">
          <Col className="col-2 align-content-center">
            <h2 className="m-0 text-start ps-4">Dashboard</h2>
            {/* TODO: assign to variable with current page name*/}
          </Col>
          <Col className="col-auto me-3">
            <Row>
              <Col>
                <img
                  src="https://ui-avatars.com/api/?name=Test+User"
                  className="img-fluid rounded-5"
                ></img>
                {/* TODO: src must be geneated with cuurent user */}
              </Col>
              <Col className="col-auto">
                <Row><b className="m-0 p-0 text-center" >Testname JustforTest</b></Row>
                <Row><em className="p-0 m-0 text-bg-light">Testname@gmail.com</em></Row>
              </Col>
              <Col className="align-content-center ">
                <Icon
                  icon="solar:menu-dots-bold"
                  height="2em"
                  rotate="90deg"
                ></Icon>
              </Col>
            </Row>
          </Col>
        </Row>
      </header>
    )
}