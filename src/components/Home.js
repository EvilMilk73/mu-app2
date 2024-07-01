import React, { Component } from "react";
import TestComponent from "./TestComponent";
import CargosPage from "./Cargo/CargosPage";
import { Container } from "reactstrap";
import ChatComponent from "./Chat/ChatComponent";
import MapRouteMenu from "./MapRouteMenu";


export class Home extends Component {
  static displayName = Home.name;

  render() {
    return (
      <div>
        {/* <CargosPage /> */}
        <TestComponent/>
      </div>
    );
  }
}
