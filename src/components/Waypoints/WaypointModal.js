import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import * as tt from "@tomtom-international/web-sdk-maps";
import * as tt_services from "@tomtom-international/web-sdk-services";
import "./WaypointModal.css";
import { Icon } from "@iconify/react";
import SearchBar from "./SearchBar";
import SearchDropDownCustomer from "./SearchDropDownCustomer";
import { useQueryClient } from "@tanstack/react-query";

export default function WaypointModal({
  //TODO: NAME PROP OF WAYPOINT
  setShowModal,
  showModal,
  updatingWaypoint, //TODO: add new prop isAdding and implennt adding functionality (see wp1)
  isCreating = false,
}) {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);
  const [map, setMap] = useState();

  const [customer, setCustomer] = useState(updatingWaypoint?.customer); //
  const [selectedCustomerId, setSelectedCustomerId] = useState(0);

  const waypoint = useRef({
    position: { lon: 26.582558500000005, lat: 48.696728763883385 }, //TODO: ADD GLOBAL DEFAULT POS
    address: "DEFAULT ADDRESS", // DEFAULT ADDRESS
  });

  const isCustomerValid = useRef(false);

  const mapElement = useRef();
  const markerElement = useRef();
  const popUpElement = useRef();

  const updatingMarkerElement = useRef();
  const updatingPopUpElement = useRef();
  const updatedPosition = useRef(waypoint.position); // temp variable for saving position selection change(so user can UNDO the changes)
  const updatedAddress = useRef(waypoint.address);

  useEffect(() => {
    setIsUpdating(false);
    if (isCreating) {
      waypoint.current = {
        position: { lon: 26.582558500000005, lat: 48.696728763883385 }, //TODO: ADD GLOBAL DEFAULT POS
        address: "DEFAULT ADDRESS", // DEFAULT ADDRESS
        name: "",
      };
      setCustomer(undefined);
      updatedPosition.current = waypoint.current.position;
      updatedAddress.current = waypoint.current.address;
    } else if (updatingWaypoint) {
      waypoint.current = { ...updatingWaypoint };
      setCustomer(updatingWaypoint.customer);
      updatedPosition.current = updatingWaypoint.position;
      updatedAddress.current = updatingWaypoint.address; // add center waypoint
      if (updatingMarkerElement.current) updatingMarkerElement.current.remove();
      if (markerElement.current) markerElement.current.remove();
    }
  }, [updatingWaypoint]);

  const toggle = () => setShowModal(!showModal);

  if (mapElement.current) {
    if (isUpdating) {
      mapElement.current.classList.remove("disabledMapDiv");
    } else {
      mapElement.current.classList.add("disabledMapDiv");
    }
  }

  const generateMap = () => {
    if (mapElement.current) {
      let map = tt.map({
        key: process.env.REACT_APP_TOMTOM_API_KEY,
        container: mapElement.current,
        center: waypoint.current.position,
        zoom: 18,
        minZoom: 14,
      });

      //map.setStyle('https://api.tomtom.com/style/2/custom/style/dG9tdG9tQEBAMkxSNHdPTkZMVkxqUGtRTzs2ZmI2NTQxOC1mMDg1LTQ0OWItOWI0Yi05NWY1MjdjNjg2YTk=/drafts/0.json?key=process.env.REACT_APP_TOMTOM_API_KEY');

      if (!isCreating) {
        let div = document.createElement("div");
        div.innerHTML = waypoint.current.address;
        var popup = new tt.Popup({
          offset: 30,
          closeButton: false,
          closeOnClick: false,
        }).setDOMContent(div);

        let markDiv = document.createElement("div");
        markDiv.classList.add("mapMark");
        let marker = new tt.Marker({ element: markDiv })
          .setLngLat(waypoint.current.position)
          .setPopup(popup)
          .setDraggable(false)
          .addTo(map); //wp1 (if is adding dont add an marker)
        marker.togglePopup();
        markerElement.current = marker;
        popUpElement.current = popup;
      } //generate marker of waypoint if its not adding modal
      setMap(map);
      console.log("React app DOM is fully loaded.");
    }
  };

  const handleTestClick = () => {
    handleSearchBarResult([26.580378, 48.689525], "Вулиця Шевченка");
  };

  const handleAcceptClick = () => {
    setIsUpdating(false);
    console.log(customer);
    //validation
    if (isCreating) {
    } else {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: waypoint.current.name,
          Latitude: String(waypoint.current.position.lat),
          Longitude: String(waypoint.current.position.lon),
          Address: waypoint.current.address,
          CustomerId: customer.id,
        }),
      };

      fetch("Waypoint/Update/" + updatingWaypoint.id, requestOptions).then(
        queryClient.invalidateQueries("waypoints", { refetchInactive: true })
      );
    }
    // adding new or update waypint in DB reset states then close
  };

  const handleDeclineClick = () => {
    setIsUpdating(!isUpdating);
    // reset stes then close
  };

  const handleSearchBarResult = (position, resultText) => {
    if (map.flyTo) map.flyTo({ center: position });

    updatingMarkerElement.current.setLngLat(position);
    let div = document.createElement("div");
    div.innerHTML = resultText;
    updatingPopUpElement.current.setDOMContent(div);
    // if (markerElement.current) markerElement.current.remove();
    // if (popUpElement.current) popUpElement.current.remove();
    // let div = document.createElement("div");
    // div.innerHTML = resultText;
    // var popup = new tt.Popup({ offset: 30, closeButton: false }).setDOMContent(
    //   div
    // );

    // let marker = new tt.Marker()
    //   .setLngLat(position)
    //   .setPopup(popup)
    //   .setDraggable(true)
    //   .on("dragend", (e) => markerDragHandle(e.target))
    //   .addTo(map);
    // marker.togglePopup();
    // markerElement.current = marker;
    // popUpElement.current = popup;
  };

  const markerDragHandle = (e) => {
    // update popUp on marker based on position
    const result = tt_services.services.reverseGeocode({
      key: process.env.REACT_APP_TOMTOM_API_KEY,
      position: e._lngLat,
    });
    result.then((value) => {
      let resultString = value.addresses[0].address.streetName;
      if (value.addresses[0].address.streetNumber)
        resultString += ", " + value.addresses[0].address.streetNumber;
      let div = document.createElement("div");
      div.innerHTML = resultString;
      updatingPopUpElement.current.setDOMContent(div);
      // waypoint.current.position = e._lngLat; //TODO: wp1
      // waypoint.current.address = resultString;
      updatedPosition.current = e._lngLat;
      updatedAddress.current = resultString;
      console.log(e._lngLat.lat + " " + e._lngLat.lng + " " + resultString);
    });
  };

  const addUpdatingMarker = () => {
    if (updatingMarkerElement.current) updatingMarkerElement.current.remove();
    if (updatingPopUpElement.current) updatingPopUpElement.current.remove();

    let popUpDiv = document.createElement("div");
    popUpDiv.innerHTML = waypoint.current.address;

    updatedPosition.current = waypoint.current.position;
    updatedAddress.current = waypoint.current.address;
    var popup = new tt.Popup({
      offset: 30,
      closeButton: false,
      closeOnClick: false,
      className: "testpp",
    }).setDOMContent(popUpDiv);

    let markDiv = document.createElement("div");
    markDiv.classList.add("mapMark");
    let marker = new tt.Marker({ element: markDiv })
      .setLngLat(waypoint.current.position)
      .setPopup(popup)
      .setDraggable(true)
      .on("dragend", (e) => markerDragHandle(e.target))
      .addTo(map);

    marker.togglePopup();

    updatingMarkerElement.current = marker;
    updatingPopUpElement.current = popup;
  };
  const handleUpdateMapCLick = () => {
    setIsUpdating(true);
    addUpdatingMarker();
  };
  const handleAcceptMapUpdateClick = () => {
    setIsUpdating(false);
    if (markerElement.current) markerElement.current.remove();
    if (popUpElement.current) popUpElement.current.remove();

    waypoint.current.position = updatedPosition.current;
    waypoint.current.address = updatedAddress.current;
    markerElement.current = updatingMarkerElement.current;
    popUpElement.current = updatingPopUpElement.current;
    markerElement.current.setDraggable(false);
    updatingMarkerElement.current = "";
    updatingPopUpElement.current = "";

    map.setCenter(waypoint.current.position);
  };
  const handleDeclineMapUpdateClick = () => {
    setIsUpdating(false);
    if (updatingMarkerElement.current) updatingMarkerElement.current.remove();
    if (updatingPopUpElement.current) updatingPopUpElement.current.remove();
    updatedPosition.current = waypoint.current.position; //TODO: wp1 (prob works good)
    updatedPosition.address = waypoint.current.address;

    map.setCenter(waypoint.current.position);
  };

  return (
    <Modal
      onOpened={generateMap}
      onClosed={() => {
        setIsUpdating(false);
        map.remove();
      }}
      isOpen={showModal}
      toggle={toggle}
    >
      {/* <Modal size="" isOpen={showModal} toggle={toggle}> */}
      <ModalBody className="p-0">
        <Row className="m-0" style={{ position: "relative" }}>
          <div
            ref={mapElement}
            className="mapDiv rounded-top-2"
            style={{
              height: "320px",
              width: "100%",
              zIndex: "0",
            }}
          />
          {/* <div
            ref={mapElement}
            className="mapDiv"
            style={{
              backgroundColor: "grey",
              height: "32em",
              width: "100%",
              zIndex: "0",
             
            }} 
          />*/}

          {isUpdating ? (
            <>
              <SearchBar
                className="mapSearchBarContainer p-0"
                waypointPosition={waypoint.current.position}
                handlePositionChange={handleSearchBarResult}
              ></SearchBar>

              <div className="mapButtonsContainer mb-2">
                <Button
                  className="mapButton m-1 p-0 declineButton border-1 border-primary"
                  onClick={handleDeclineMapUpdateClick}
                >
                  <Icon
                    icon="ion:close"
                    className="m-0 b-0"
                    fontSize="2rem"
                    color="#0f3158"
                  ></Icon>
                </Button>
                <Button
                  className="mapButton acceptButton m-1 p-0"
                  onClick={handleAcceptMapUpdateClick}
                >
                  <Icon
                    icon="ion:checkmark"
                    className="m-0 b-0"
                    color="white"
                    fontSize="2rem"
                  ></Icon>
                </Button>
              </div>
            </>
          ) : (
            <div className="mapButtonsContainer mb-2">
              <Button
                className="mapButton acceptButton m-1 p-0"
                onClick={handleUpdateMapCLick}
              >
                <Icon
                  icon="ion:pencil"
                  className="m-0 b-0"
                  color="white"
                  fontSize="2rem"
                ></Icon>
              </Button>
            </div>
          )}
        </Row>
        <Row className="m-0 px-2">
          <Row className="m-0">
            <h5>{updatedAddress.current}</h5>
            <span className="text-secondary mb-1">Waypoint name</span>
            <Input
              className="w-100 mb-3"
              value={waypoint.current.name}
              onChange={(e) => (waypoint.current.name = e.target.value)}
            ></Input>
            <span className="text-secondary mb-1">Customer name</span>

            <SearchDropDownCustomer
              inputWidth="100%"
              className="p-0 mb-2"
              setSelectedItem={setCustomer}
              selectedItem={customer}
            ></SearchDropDownCustomer>

            <span className="text-secondary mb-1">telephone number</span>
            <Label className="ps-3">
              {customer && customer.tel_Number !== ""
                ? customer.tel_Number
                : <span className="text-secondary">"+380000000000"</span>}
            </Label>
            <span className="text-secondary mb-1">E-mail</span>
            <Label className="ps-3">
              {customer && customer.e_Mail !== ""
                ? customer.e_Mail
                :<span className="text-secondary"> "exanple@gmail.com"</span>}
            </Label>
          </Row>
          <Row className="m-0 justify-content-end">
            <Button
              className="me-3 mb-1 p-1 bg-transparent emptyButton border-primary"
              style={{ width: "12rem" }}
              onClick={handleTestClick}
            >
              Decline
            </Button>
            <Button
              className="bg-primary me-3 mb-1 text-white"
              style={{ width: "12rem" }}
              onClick={handleAcceptClick}
            >
              Accept
            </Button>
          </Row>
        </Row>
      </ModalBody>
      {/* <ModalBody>
        <Row>
          <Col xs="4">
            <h4>Map Controls</h4>
            <FormGroup>
              <Label for="longitude">Longitude</Label>
              <Input
                type="text"
                name="longitude"
                value={mapLongitude}
                onChange={(e) => setMapLongitude(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="latitude">Latitude</Label>
              <Input
                type="text"
                name="latitude"
                value={mapLatitude}
                onChange={(e) => setMapLatitude(e.target.value)}
              />
            </FormGroup>
            <Col xs="12">
              <Row>Zoom</Row>
              <Row>
                <Button outline color="primary" onClick={decreaseZoom}>
                  -
                </Button>
                <div className="mapZoomDisplay">{mapZoom}</div>
                <Button outline color="primary" onClick={increaseZoom}>
                  +
                </Button>
              </Row>
            </Col>
            <Col xs="12">
              <Row className="updateButton">
                <Button color="primary" onClick={updateMap}>
                  Update Map
                </Button>
              </Row>
            </Col>
          </Col>
          <Col xs="8">
        <div ref={mapElement} className="mapDiv" />
          </Col>
        </Row>
      </ModalBody> */}
    </Modal>
  );
}
