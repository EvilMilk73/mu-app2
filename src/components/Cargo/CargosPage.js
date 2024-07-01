import {
  Container,
  Row,
  Col,
  Button,
  Collapse,
  Table,
  Input,
  InputGroup,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  InputGroupText,
  Pagination,
  PaginationItem,
} from "reactstrap";
import React, { useEffect, useState, useRef } from "react";
import CargoTableRow from "./CargoTableRow";
import { CaretDownFill, CaretUpFill } from "react-bootstrap-icons";
import "./CargosPage.css";
import { Search } from "react-bootstrap-icons";
import ConfirmationModal from "../ConfirmationModal";
import TablePagination from "../TablePagination";
// TODO searchbar enter handle

export default function CargosPage() {
  const [cargos, setCargoes] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [orderedBy, setOrderedBy] = useState(""); // Possible values: '', 'Name', 'Waypoint' etc
  const [orderDirection, setOrderDirection] = useState(true); // Asc - true Desc-false
  const orderProp = useRef("");
  const searchQuery = useRef("");

  const [currentPage, setCurrentPage] = useState(1);
  const [tableSize, setTableSize] = useState(5);
  const [sizeSelectDropdownOpen, setSizeSelectDropdownOpen] = useState(false);

  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteConfirmModalProps, setDeleteConfirmModalProps] = useState({
    confirmationMessage: "",
    actionOnAccept: () => {},
    actionOnDecline: () => {},
  });

  const [addingRowVisibility, setAddingRowVisibility] = useState(false);
  const fetchCargos = async () => {
    try {
      let query = "";
      if (searchQuery.current !== "" || orderProp.current !== "") {
        query += "?";
        if (searchQuery.current !== "") {
          query += "SearchQuery=" + searchQuery.current + "&";
        }
        if (orderProp.current !== "") {
          const orderDir = orderDirection ? "Asc" : "Desc";
          query +=
            "OrderBy=" + orderProp.current + "&OrderDirection=" + orderDir;
        }
        if (
          query.charAt(query.length - 1) === "?" ||
          query.charAt(query.length - 1) === "&"
        ) {
          query = query.slice(0, -1);
        }
      }

      const response = await fetch("Cargo" + query); //Query format Cargo?OrderProp1=OrderValue1&OrderProp2=OrderValue2.....
      const data = await response.json();
      setCargoes(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  const fetchCustomers = async () => {
    try {
      const response = await fetch("Customer");
      const data = await response.json();

      setCustomers(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    console.log("fetch");
    fetchCargos();
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchCargos();
  }, [orderDirection, orderedBy]);

  const tdClass = "border-start border-end pb-0 ps-4";

  const isColumnOrdering = (columnName) => {
    if (orderedBy === columnName) {
      return true;
    }
    return false;
  };
  const columnHeaderClickHandle = (columnName, orderPropertyPath) => {
    orderProp.current = orderPropertyPath;
    if (columnName !== orderedBy) {
      setOrderedBy(columnName);
      setOrderDirection(true);
      return;
    }
    if (orderDirection) {
      setOrderDirection(false);
    } else {
      setOrderedBy("");
      orderProp.current = "";
      setOrderDirection(true);
    }

    const str = orderedBy;
  };
  const RenderTableColHead = ({ columnName, className, orderPropertyPath }) => {
    //orderPropertyPath = "waypoint.customer.name"
    return (
      <th
        className={className}
        onClick={() => columnHeaderClickHandle(columnName, orderPropertyPath)}
      >
        <div className="d-flex align-items-center justify-content-between">
          <div>{columnName}</div>
          <div className="d-flex flex-column ms-2" style={{ minWidth: "10px" }}>
            {isColumnOrdering(columnName) ? (
              orderDirection ? (
                <CaretUpFill width={10} height={10} />
              ) : (
                <CaretDownFill width={10} height={10} />
              )
            ) : null}
          </div>
        </div>
      </th>
    );
  };

  const handleDeleteCargoAction = (deleteConfirmModalProps) => {
    const defaults = {
      confirmationMessage: "",
      actionOnAccept: () => {},
      actionOnDecline: () => {},
    };
    setDeleteConfirmModalProps({ ...defaults, ...deleteConfirmModalProps });
    setShowDeleteConfirmModal(true);
  };

  const toggleSizeSelect = () =>
    setSizeSelectDropdownOpen((prevState) => !prevState);

  return (
    <>
      <Container className="col-9">
        <Container className="p-0 d-flex">
          <Col>
            <Dropdown isOpen={sizeSelectDropdownOpen} toggle={toggleSizeSelect}>
              <DropdownToggle className="bg-transparent p-1 text-black" caret>
                {" "}
                {tableSize}
              </DropdownToggle>
              <DropdownMenu className="p-0 m-0" style={{ minWidth: "2rem" }}>
              <DropdownItem
                  className="ps-1 pt-1"
                  onClick={() => setTableSize(5)}
                >
                  5
                </DropdownItem>
                <DropdownItem
                  className="ps-1 pt-1"
                  onClick={() => setTableSize(10)}
                >
                  10
                </DropdownItem>
                <DropdownItem
                  className="ps-1 pt-1"
                  onClick={() => setTableSize(15)}
                >
                  15
                </DropdownItem>
                <DropdownItem
                  className="ps-1 pt-1"
                  onClick={() => setTableSize(20)}
                >
                  20
                </DropdownItem>
                <DropdownItem
                  className="ps-1 pt-1"
                  onClick={() => setTableSize(25)}
                >
                  25
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
          <Col className="col-3 align-self-right">
            <InputGroup>
              <Input
                className="border-end-0 border-secondary"
                style={{ boxShadow: "none" }}
                placeholder="Search"
                onChange={(e) => (searchQuery.current = e.target.value)}
              />
              <Button
                className="p-1 bg-transparent border-start-0 border-secondary"
                style={{ boxShadow: "none" }}
                onClick={() => fetchCargos()}
              >
                <Search className="p-0 m-0" color="black" />
              </Button>
            </InputGroup>
          </Col>
        </Container>
        <Table className="table-hover">
          <thead>
            <tr>
              <RenderTableColHead
                columnName="Name"
                className="col-3"
                orderPropertyPath="waypoint.customer.name"
              ></RenderTableColHead>
              <RenderTableColHead
                columnName="Waypoint"
                className="col-3"
                orderPropertyPath="waypoint.name"
              ></RenderTableColHead>
              <RenderTableColHead
                columnName="Size"
                className="col-1"
                orderPropertyPath="size"
              ></RenderTableColHead>
              <RenderTableColHead
                columnName="Weight"
                className="col-1"
                orderPropertyPath="weight"
              ></RenderTableColHead>
              <RenderTableColHead
                columnName="Date"
                className="col-3"
                orderPropertyPath="date"
              ></RenderTableColHead>
            </tr>
          </thead>
          <tbody className="table-group-divider">
           {addingRowVisibility && <CargoTableRow 
                    Customers={customers}
                    reloadTable={fetchCargos}
                    handleDeleteCargoAction={handleDeleteCargoAction}
                    addingRow={addingRowVisibility}
                    setAddingRow={setAddingRowVisibility}></CargoTableRow>}
            {cargos.length !== 0 &&
              customers.length !== 0 &&
              cargos
                .slice((currentPage - 1) * tableSize, currentPage * tableSize)
                .map((item) => (
                  <CargoTableRow
                    key={item.id}
                    Cargo={item}
                    Customers={customers}
                    reloadTable={fetchCargos}
                    handleDeleteCargoAction={handleDeleteCargoAction}
                  ></CargoTableRow>
                ))}
           
          </tbody>
        </Table>
        <Container className="d-flex flex-row justify-content-between p-0">
          <Col className="col-auto">
            <TablePagination
              totalPages={Math.ceil(cargos.length / tableSize)}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            ></TablePagination>
          </Col>
          <Button className="bg-primary" onClick={() => setAddingRowVisibility(true)}>Add</Button>
        </Container>
      </Container>
      <ConfirmationModal
        {...deleteConfirmModalProps}
        setShowModal={setShowDeleteConfirmModal}
        showModal={showDeleteConfirmModal}
      ></ConfirmationModal>

      {/* {(Cargos.length !== 0 && Customers.length !== 0 ) &&<Container className="">
        
        {Cargos.map((item) => (
          <CargoCard
            Cargo={item}
            key={item.id}
            onClick={() => {
              setModalCargo(item);
              setShowModal(true);
            }}
          />
          
        ))}
        
        {ModalCargo && <CargoModal setShowModal={setShowModal} showModal={ShowModal} Cargo={ModalCargo} Customers={Customers} />}
      </Container>} */}
    </>
  );
}
