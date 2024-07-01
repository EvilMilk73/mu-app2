import React, { useState, useEffect, useRef } from "react";
import SearchDropDown from "../SearchDropDown";
import { Input, Button, Card, CardBody, Collapse } from "reactstrap";
import {
  PencilSquare,
  Trash,
  ArrowClockwise,
  CheckLg,
  XLg,
} from "react-bootstrap-icons";
import "./CargoTableRow.css";
import ConfirmationModal from "../ConfirmationModal";
export default function CargoTableRow({
  Cargo,
  Customers,
  reloadTable,
  handleDeleteCargoAction,
  addingRow = false,
  setAddingRow,
}) {
  const [updating, setUpdating] = useState(false);

  return (
    <>
      {addingRow ? (
        <RenderAddingRow Customers={Customers} reloadTable={reloadTable} setAddingRow={setAddingRow}/>
      ) : updating ? (
        <RenderUpdatingRow
          Cargo={Cargo}
          Customers={Customers}
          setUpdating={setUpdating}
          reloadTable={reloadTable}
        />
      ) : (
        <RenderStaticRow
          Cargo={Cargo}
          setUpdating={setUpdating}
          handleDeleteCargoAction={handleDeleteCargoAction}
          reloadTable={reloadTable}
        />
      )}
    </>
  );
}
const RenderStaticRow = ({
  Cargo,
  setUpdating,
  reloadTable,
  handleDeleteCargoAction,
}) => {
  const [isDescriptionOpen, setIsdescriptionOpen] = useState(false);

  const toogle = () => setIsdescriptionOpen(!isDescriptionOpen);

  const deleteCargo = async () => {
    await fetch("/Cargo/Delete/" + Cargo.id, { method: "DELETE" }).catch(
      (error) => console.log(error)
    );
    await reloadTable();
  };
  const handleDeleteClick = () => {
    handleDeleteCargoAction({
      confirmationMessage: "qwe",
      actionOnAccept: () => deleteCargo(),
      actionOnDecline: () => {},
    });
  };
  const tdClass = "border-start border-end p-1 ps-2";
  return (
    <>
      <tr onClick={toogle}>
        {/* Enable userselect when description is open style={!isDescriptionOpen? {userSelect:'none'} : {}} */}
        <td className={tdClass}>{Cargo.waypoint.customer.name}</td>
        <td className={tdClass}> {Cargo.waypoint.name}</td>
        <td className={tdClass}>{Cargo.size}</td>
        <td className={tdClass}>{Cargo.weight}</td>
        <td className={tdClass}>{Cargo.date}</td>
        <td className={tdClass + "pt-0"} style={{ textAlign: "center" }}>
          <Button
            className="p-0 me-2 bg-transparent border-0 NoShadow"
            style={{ lineHeight: "0" }}
            onClick={() => setUpdating(true)}
          >
            <PencilSquare color="blue"></PencilSquare>
          </Button>
          <Button
            onClick={handleDeleteClick}
            className="p-0 bg-transparent border-0 NoShadow"
            style={{ lineHeight: "0" }}
          >
            <Trash color="red"></Trash>
          </Button>
        </td>
      </tr>
      <tr>
        <td
          colSpan={6}
          className={`p-0 border-start border-end ${
            !isDescriptionOpen ? "description-closed" : "" // fix issue when collapse is closed 2 bottom borders overlaps
          }`}
        >
          <Collapse isOpen={isDescriptionOpen}>
            <Card className="border-0">
              <CardBody>{Cargo.description}</CardBody>
            </Card>
          </Collapse>
        </td>
      </tr>
    </>
  );
};

const RenderUpdatingRow = ({ Cargo, Customers, setUpdating, reloadTable }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(
    Cargo.waypoint.customer.id
  );
  const [selectedWaypointId, setSelectedWaypointId] = useState(
    Cargo.waypoint.id
  );
  const [waypoints, setWaypoints] = useState([]); //waypoints related to selected user
  const updatedCargo = useRef({
    size: String(Cargo?.size),
    weight: String(Cargo?.weight),
    date: String(Cargo?.date),
    description: String(Cargo?.description),
  });
  const isCustomerValid = useRef(false);
  const isWaypointValid = useRef(false);
  useEffect(() => {
    setWaypoints([]);
    const selectedCustomer = Customers.find((c) => c.id === selectedCustomerId);
    if (selectedCustomer) {
      setWaypoints(selectedCustomer.waypoints);
      if (
        selectedCustomer.waypoints.find((w) => w.id === selectedWaypointId) ===
        undefined
      ) {
        setSelectedWaypointId(-1);
      }
    }
  }, [selectedCustomerId]);
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

  const handleSubmitClick = async () => {
    setUpdating(false);
    if (validateCargo()) {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: updatedCargo.current.size,
          weight: updatedCargo.current.weight,
          description: updatedCargo.current.description,
          waypointId: selectedWaypointId,
          date: updatedCargo.current.date,
        }),
      };
      await fetch("/Cargo/Update/" + Cargo.id, requestOptions).catch((error) =>
        console.log(error)
      );
      await reloadTable();
    }
  };
  const tdClass = "border-start border-end p-1 ps-2";
  return (
    <>
      <tr>
        <td className={tdClass}>
          <SearchDropDown
            items={Customers}
            selectedItemId={selectedCustomerId}
            setSelectedItemId={setSelectedCustomerId}
            isValid={isCustomerValid}
          />
        </td>
        <td className={tdClass}>
          {waypoints.length > 0 ? (
            <SearchDropDown
              items={waypoints}
              selectedItemId={selectedWaypointId}
              setSelectedItemId={setSelectedWaypointId}
              isValid={isWaypointValid}
            />
          ) : null}
        </td>
        <td className={tdClass}>
          <Input
            className="NoShadow border-0 p-0"
            defaultValue={updatedCargo.current.size}
            onChange={(e) => (updatedCargo.current.size = e.target.value)}
          ></Input>
        </td>
        <td className={tdClass}>
          <Input
            className="NoShadow border-0 p-0"
            defaultValue={updatedCargo.current.weight}
            onChange={(e) => (updatedCargo.current.weight = e.target.value)}
          ></Input>
        </td>
        <td className={tdClass}>
          <Input
            className="NoShadow border-0 p-0"
            type="date"
            defaultValue={updatedCargo.current.date}
            onChange={(e) => (updatedCargo.current.date = e.target.value)}
          ></Input>
        </td>
        <td className={tdClass + "p-0 m-0"} style={{ textAlign: "center" }}>
          <Button
            className="p-0 me-2 bg-transparent border-0 NoShadow"
            style={{ lineHeight: "0" }}
            onClick={handleSubmitClick}
          >
            <CheckLg color="green"></CheckLg>
          </Button>
          <Button
            className="p-0 bg-transparent border-0 NoShadow"
            style={{ lineHeight: "0" }}
            onClick={() => setUpdating(false)}
          >
            <ArrowClockwise color="orange"></ArrowClockwise>
          </Button>
        </td>
      </tr>
      <tr>
        <td colSpan={6} className="p-0 border-start border-end">
          <Collapse isOpen={true}>
            <Card className="border-0">
              <CardBody className="p-0">
                <Input
                  className="NoShadow border-0"
                  name="description"
                  defaultValue={updatedCargo.current.description}
                  onChange={(e) =>
                    (updatedCargo.current.description = e.target.value)
                  }
                  type="textarea"
                />
              </CardBody>
            </Card>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
const RenderAddingRow = ({ Customers, setAddingRow, reloadTable }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState(-1);
  const [selectedWaypointId, setSelectedWaypointId] = useState(-1);
  const [waypoints, setWaypoints] = useState([]); //waypoints related to selected user
  const updatedCargo = useRef({
    size: 0,
    weight: 0,
    date: (new Date()).toJSON().split("T")[0],
    description: "",
  });
  const isCustomerValid = useRef(false);
  const isWaypointValid = useRef(false);
  useEffect(() => {
    setWaypoints([]);
    const selectedCustomer = Customers.find((c) => c.id === selectedCustomerId);
    if (selectedCustomer) {
      setWaypoints(selectedCustomer.waypoints);
      if (
        selectedCustomer.waypoints.find((w) => w.id === selectedWaypointId) ===
        undefined
      ) {
        setSelectedWaypointId(-1);
      }
    }
  }, [selectedCustomerId]);

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

  const handleSubmitClick = async () => {
    setAddingRow(false);
    if (validateCargo()) {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          size: updatedCargo.current.size,
          weight: updatedCargo.current.weight,
          description: updatedCargo.current.description,
          waypointId: selectedWaypointId,
          date: updatedCargo.current.date,
        }),
      };
      await fetch("/Cargo/AddCargo", requestOptions).catch((error) =>
        console.log(error)
      );
      await reloadTable();
        }
  };
  const tdClass = "border-start border-end p-1 ps-2";
  return (
    <>
      <tr>
        <td className={tdClass}>
          <SearchDropDown
            items={Customers}
            selectedItemId={selectedCustomerId}
            setSelectedItemId={setSelectedCustomerId}
            isValid={isCustomerValid}
          />
        </td>
        <td className={tdClass}>
          {waypoints.length > 0 ? (
            <SearchDropDown
              items={waypoints}
              selectedItemId={selectedWaypointId}
              setSelectedItemId={setSelectedWaypointId}
              isValid={isWaypointValid}
            />
          ) : null}
        </td>
        <td className={tdClass}>
          <Input
            className="NoShadow border-0 p-0"
            defaultValue={updatedCargo.current.size}
            onChange={(e) => (updatedCargo.current.size = e.target.value)}
          ></Input>
        </td>
        <td className={tdClass}>
          <Input
            className="NoShadow border-0 p-0"
            defaultValue={updatedCargo.current.weight}
            onChange={(e) => (updatedCargo.current.weight = e.target.value)}
          ></Input>
        </td>
        <td className={tdClass}>
          <Input
            className="NoShadow border-0 p-0"
            type="date"
            defaultValue={updatedCargo.current.date}
            onChange={(e) => (updatedCargo.current.date = e.target.value)}
          ></Input>
        </td>
        <td className={tdClass + "p-0 m-0"} style={{ textAlign: "center" }}>
          <Button
            className="p-0 me-2 bg-transparent border-0 NoShadow"
            style={{ lineHeight: "0" }}
            onClick={handleSubmitClick}
          >
            <CheckLg color="green"></CheckLg>
          </Button>
          <Button
            className="p-0 bg-transparent border-0 NoShadow"
            style={{ lineHeight: "0" }}
            onClick={() => setAddingRow(false)}
          >
            <XLg color="red"></XLg>
          </Button>
        </td>
      </tr>
      <tr>
        <td colSpan={6} className="p-0 border-start border-end">
          <Collapse isOpen={true}>
            <Card className="border-0">
              <CardBody className="p-0">
                <Input
                  className="NoShadow border-0"
                  name="description"
                  defaultValue={updatedCargo.current.description}
                  onChange={(e) =>
                    (updatedCargo.current.description = e.target.value)
                  }
                  type="textarea"
                />
              </CardBody>
            </Card>
          </Collapse>
        </td>
      </tr>
    </>
  );
};
