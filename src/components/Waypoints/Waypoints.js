import React, { useState, useRef, useEffect, useCallback } from "react";
import CachingImage from "../Helpers/CachingImage";
import { useQuery } from "@tanstack/react-query";
import { Button, Input, InputGroup, InputGroupText } from "reactstrap";
import WaypointModal from "./WaypointModal";
import WaypointCard from "./WaypointCard";
import { Icon } from "@iconify/react";
import "./Waypoints.css";
import debounce from "lodash/debounce";
import SearchDropDownCustomer from "./SearchDropDownCustomer";
const orderOptions = {
  name: "name",
  customer: "customer",
  address: "address",
};
export default function Waypoints() {
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState(-1);
  const [isModalCreating, setIsModalCreating] = useState(false);
  const [filters, setFilters] = useState({
    searchQuery: "", //make debounce or smth
    orderBy: orderOptions.name,
    orderDirection: "Asc", //Acs|Dec
    customerFilter: [],
  });
  const [debouncedFilters, setDebouncedFilters] = useState("");
  const [customers, setCustomers] = useState([]); //temp

  useEffect(() => {
    if (customers) {
      setFilters({
        ...filters,
        customerFilter: customers,
      });
    }
  }, [customers]);

  useEffect(() => {
    
    debouncedSetFilter(filters,setIsLoading)
  }, [filters]);
  const items = useQuery({
    queryKey: ["waypoints", debouncedFilters],
    queryFn: () => fetchItems(debouncedFilters),
  });

  const debouncedSetFilter = useCallback(
    debounce((filters, setIsLoading) => {
      setDebouncedFilters(filters);
      setIsLoading(false);
    }, 1000),
    []
  );
  const fetchItems = async () => {
    let queryString = "Waypoint";
    queryString = queryString + "?";
    if (debouncedFilters.searchQuery.trim() !== "") {
      queryString =
        queryString + "SearchQuery=" + debouncedFilters.searchQuery + "&";
    }
    if (debouncedFilters.customerFilter.length > 0) {
      queryString = queryString + "CustomersIds=";
      debouncedFilters.customerFilter.forEach((element) => {
        queryString = queryString + element.id + ",";
      });
      queryString = queryString.slice(0, -1); // remove last comma
      queryString = queryString + "&";
    }

    queryString = queryString.slice(0, -1); // remove last &
    const response = await fetch(queryString);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json().then((data) => {
      return data.map((item) => ({
        position: {
          lat: parseFloat(item.latitude),
          lon: parseFloat(item.longitude),
        },
        ...item,
      }));
    });
  };

  const toggle = () => setModal(!modal);

  return (
    <div className="d-flex m-0 p-0 flex-wrap">
      <div id="contentHeader" className="mb-2 pt-1">
        <InputGroup
          className="ps-2 me-2"
          style={{ width: "20rem", height: "2rem" }}
        >
          <InputGroupText>
            <Icon icon="ion:search"></Icon>
          </InputGroupText>
          <Input
            id="searchBar"
            placeholder="Search for waypoint"
            onChange={(e) => {
              setFilters({ ...filters, searchQuery: e.target.value });
            }}
          ></Input>
        </InputGroup>
        <SearchDropDownCustomer
          className="pe-2"
          inputPlaceholder= "SelectCustomer"
          selectedItem={customers}
          setSelectedItem={setCustomers}
          multipleSelection={true}
        ></SearchDropDownCustomer>
        {filters.customerFilter &&
          filters.customerFilter.map((item) => (
            <div className="customerLabel rounded-2 p-2">
              <span className="flex-grow-1">{item.name}</span>
              <Icon
                icon="ion:close-outline"
                className="ms-1 closeButton"
                fontSize="1.5rem"
              ></Icon>
            </div>
          ))}
      </div>
      <div className="ps-2 contentContainer">
        {items.data &&
          items.data.length > 0 &&
          items.data.map((item) => (
            <WaypointCard
              key={item.id}
              waypoint={item}
              onClick={() => {
                setSelectedWaypoint(item);
                if (isModalCreating) setIsModalCreating(false);
                toggle();
              }}
            ></WaypointCard>
          ))}

        <WaypointCard
          waypoint={{
            name: "name",
            address: "address",
            position: { lat: 0, lon: 0 },
            customer: {
              name: "custName",
              tel_Number: "123123123123",
              e_Mail: "asdasd@",
            },
          }}
          onClick={() => {
            setSelectedWaypoint(undefined);
            if (!isModalCreating) setIsModalCreating(true);
            toggle();
          }}
        ></WaypointCard>
      </div>
      <WaypointModal
        setShowModal={setModal}
        showModal={modal}
        updatingWaypoint={selectedWaypoint}
        isCreating={isModalCreating}
      ></WaypointModal>
    </div>
  );
}
