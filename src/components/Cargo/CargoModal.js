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
} from "reactstrap";
import "./CargoModal.css";
import SearchDropDown from "../SearchDropDown";

export default function CargoModal({
  Cargo,
  Customers,
  setShowModal,
  showModal,
}) {
  const [waypoints, setWaypoints] = useState([]);
  const isCustomerValid = useRef(false);
  const isWaypointValid = useRef(false);
  const [selectedWaypointId, setSelectedWaypointId] = useState(
    Cargo.waypoint.id
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    Cargo.waypoint.customer.id
  );
  const [weight, setWeight] = useState(Cargo.weight);
  const [size, setSize] = useState(Cargo.size);
  const [description, setDescription] = useState(Cargo.description);
  const [date, setDate] = useState(Cargo.date);
  useEffect(() => {
    const selectedCustomer = Customers.find((c) => c.id === selectedCustomerId);
    setWaypoints(selectedCustomer.waypoints);
    setSelectedCustomerId(Cargo.waypoint.customer.id);
    setSelectedWaypointId(Cargo.waypoint.id);
    setWeight(Cargo.weight);
    setSize(Cargo.size);
    setDescription(Cargo.description);
    setDate(Cargo.date);
    isCustomerValid.current = true;
    isWaypointValid.current = true;
  }, [Cargo]);

  useEffect(() => {
    const selectedCustomer = Customers.find((c) => c.id === selectedCustomerId);
    setWaypoints(selectedCustomer.waypoints);
    if (
      selectedCustomer.waypoints.find((w) => w.id === selectedWaypointId) ===
      undefined
    )
      setSelectedWaypointId(0);
  }, [selectedCustomerId]);

  const toggle = () => {
    setShowModal(!showModal);
  };

  const RenderBody = () => {
    return (
      <Form className="p-2">
        <FormGroup row className="pb-1">
          <Col>
            <p>Замовник</p>
            <SearchDropDown
              items={Customers}
              setSelectedItemId={setSelectedCustomerId}
              selectedItemId={selectedCustomerId}
              isValid={isCustomerValid}
            ></SearchDropDown>
          </Col>
          <Col>
            <Row>
              <Col>
                <p>Розмір</p>
                <Input
                  name="sizeInput"
                  type="number"
                  defaultValue={size}
                  onChange={(e) => setSize(e.target.value)}
                ></Input>
              </Col>

              <Col>
                <p>Вага</p>
                <Input
                  type="number"
                  name="weight"
                  defaultValue={weight}
                  onChange={(e) => setWeight(e.target.value)}
                ></Input>
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup row className="pb-1">
          <Col>
            <p>Точка доставки</p>
            {waypoints.length !== 0 && (
              <SearchDropDown
                items={waypoints}
                setSelectedItemId={setSelectedWaypointId}
                selectedItemId={selectedWaypointId}
                isValid={isWaypointValid}
              ></SearchDropDown>
            )}
          </Col>
          <Col>
            <p>Дата</p>
            <Input
              type="Date"
              defaultValue={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <p>Опис</p>
          <Input
            id="exampleText"
            name="description"
            defaultValue={description}
            onChange={(e) => setDescription(e.target.value)}
            type="textarea"
          />
        </FormGroup>
      </Form>
    );
  };

  const validateCargo = () => {
    let isValid = true;

    if (!isCustomerValid.current) {
      alert("Please select Customer");
      isValid = false;
    }
    if (!isWaypointValid.current) {
      alert("Please select Waypoint");
      isValid = false;
    }

    return isValid;
  };
  const sumbitClickHandler = () => {
    
    
    if (validateCargo()) {
      
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: String(size),
          weight: String(weight),
          description: description,
          waypointId: selectedWaypointId,
          date: date,
        }),
      };
      
      const response =  fetch("/Cargo/Update/"+ Cargo.id, requestOptions);
        
    }

  };
  return (
    <Modal isOpen={showModal} toggle={toggle} size="lg">
      {console.log("render")}
      <ModalHeader>Update Cargo</ModalHeader>
      <ModalBody>
        <RenderBody />
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={sumbitClickHandler}>
          Update
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
}
