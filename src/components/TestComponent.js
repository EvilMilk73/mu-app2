import { Container, Button } from "reactstrap";
import React, { useState, useRef, useEffect } from "react";
import CachingImage from "./Helpers/CachingImage";
import WaypointCard from "./Waypoints/WaypointCard";
import "./TestComponent.css";

import WaypointModal from "./Waypoints/WaypointModal";
import Waypoints from "./Waypoints/Waypoints";

const MAX_ZOOM = 17;
export default function TestComponent() {
  const [modal, setModal] = useState(false);
  const [waypointId, setWaypointId] = useState(5);
  const toggle = () => setModal(!modal);
  return (
    <>
      <Waypoints></Waypoints>

      {/* <Container className="mapContainer">
        <Button onClick={toggle}>TEST</Button>
        <Button
          onClick={() => {
            setWaypointId(waypointId + 1);
          }}
        >
          change id
        </Button>
      </Container>
      <WaypointModal
        setShowModal={setModal}
        showModal={modal}
        updatingWaypoint={{
          position: { lon: 26.582558500000005, lat: 48.696728763883385 }, //:udatingWaypoint.position
          name: "test",
          address: "None",
          customer: {},
          isNew: true,
        }}
      ></WaypointModal> */}
    </>
  );
}
