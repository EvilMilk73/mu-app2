import React from "react";
import { Container, Col, Row, Nav, NavItem, NavLink } from "reactstrap";
import { Icon, InlineIcon } from "@iconify/react";
import "./SideBarMenu.css";
export default function SideBarMenu({props}) {
  const menuItemStyle =
    "justify-content-start menu-item rounded-4 pt-3 pb-3 ps-3";
  const menuItemIconStyle = "col-auto pe-1 pb-0";
  const menuItemTextStyle = "col-auto text-start ps-1 mb-0";

  return (
    <Container id="sideBar" className="text-light h-100 bg-menu-bg pt-4 ps-4" >
      <Row className="justify-content-start" style={{ paddingBottom: "5rem" }}>
        <Icon
          className="col-auto pe-0 pb-0"
          icon="icon-park-outline:transporter"
          height="3em"
        />
        <h1 className="col-auto text-start ps-1">TrsporteRR</h1>
      </Row>
      <Row className="ms-2 me-2">
        <h3 className="text-start pb-1">Menu</h3>
        <Nav vertical className="m-0 p-0">
          <NavItem>
            <NavLink className="text-light" to="/">
              <Row className={menuItemStyle}>
                <Icon
                  className={menuItemIconStyle}
                  icon="mage:dashboard"
                  height="2em"
                />
                <h4 className={menuItemTextStyle}>Dashboard</h4>
              </Row>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="text-light" to="/counter">
              <Row className={menuItemStyle}>
                <Icon
                  className={menuItemIconStyle}
                  icon="mdi:routes"
                  height="2em"
                />
                <h4 className={menuItemTextStyle}>Routes</h4>
              </Row>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="text-light" to="/fetch-data">
              <Row className={menuItemStyle}>
                <Icon
                  className={menuItemIconStyle}
                  icon="mdi:drivers-license-outline"
                  height="2em"
                />
                <h4 className={menuItemTextStyle}>Drivers</h4>
              </Row>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="text-light" to="/fetch-data">
              <Row className={menuItemStyle}>
                <Icon
                  className={menuItemIconStyle}
                  icon="game-icons:cargo-crate"
                  height="2em"
                />
                <h4 className={menuItemTextStyle}>Cargos</h4>
              </Row>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink className="text-light" to="/fetch-data">
              <Row className={menuItemStyle}>
                <Icon
                  className={menuItemIconStyle}
                  icon="lucide:waypoints"
                  height="2em"
                />
                <h4 className={menuItemTextStyle}>Waypoints</h4>
              </Row>
            </NavLink>
          </NavItem>
        </Nav>
      </Row>
    </Container>
  );
}
