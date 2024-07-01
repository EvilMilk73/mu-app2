import React, { Component } from "react";
import { Container, Col, Row, Nav, NavItem, NavLink } from "reactstrap";
import { NavMenu } from "../NavMenu";
import { Link } from "react-router-dom";
import { Icon, InlineIcon } from "@iconify/react";
import SideBarMenu from "./SideBarMenu";
import ContentHeader from "./ContentHeader";
import "./Layout.css";

export class Layout extends Component {
  //TODO: FIX LAYOUNT TO STATIC OR IDC DO SMTH
  static displayName = Layout.name;

  render() {
    return (
      <div id="LayoutContainer">
        <SideBarMenu></SideBarMenu>

        <div>
          <ContentHeader></ContentHeader>
          <div id="main" tag="main" className="">
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
