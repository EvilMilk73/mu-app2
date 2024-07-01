import React, { useState, useEffect, useCallback, useRef } from "react";
import { Input, Label, Spinner } from "reactstrap";
import "./SearchDropDownCustomer.css";
import debounce from "lodash/debounce";
import { useQuery } from "@tanstack/react-query";

import { Icon, loadIcon } from "@iconify/react";
export default function SearchDropDownCustomer({
  // TODO: refactor for use with differnt items sources (add new props: // fetchAddress and fetchProp('SearchQuerry' by default))
  // after use it in fetchItems funcion.
  inputWidth = "20rem",
  setSelectedItem,
  selectedItem,
  multipleSelection = false,
  inputPlaceholder = "Search",
  ...props
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isOpened, setIsOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //const [items, setItems] = useState([]);

  const items = useQuery({
    queryKey: ["customers", debouncedQuery],
    queryFn: () => fetchItems(debouncedQuery),
  });

  const debouncedSetQuery = useCallback(
    debounce((query, setIsLoading) => {
      setDebouncedQuery(query);
      setIsLoading(false);
    }, 1000),
    []
  );
  useEffect(() => {
    if (searchQuery !== debouncedQuery) {
      //that condition is false only on init render
      setIsLoading(true);
    }
    debouncedSetQuery(searchQuery, setIsLoading);
  }, [searchQuery]);

  useEffect(() => {
    if (selectedItem && selectedItem.name) setSearchQuery(selectedItem.name);
    else setSearchQuery("");
  }, [selectedItem]);

  if (items.isError) {
    console.log(items.error.message);
  }

  const fetchItems = async (query) => {
    let queryString = "Customer";
    if (query.trim() !== "") {
      queryString = queryString + "?SearchQuery=" + query;
    }
    const response = await fetch(queryString);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const closeResults = () => {
    setIsOpened(false);
  };
  const handleResultClick = (item) => {
    if (multipleSelection) {
      if (!selectedItem.some((i) => i.id === item.id)) {
        setSelectedItem([...selectedItem, item]);
      } else {
        let removeIndex = selectedItem.indexOf(item);
        if (removeIndex !== -1) {
          setSelectedItem(selectedItem.toSpliced(removeIndex, 1));
        }
      }
    } else {
      setSelectedItem(item);
    }
  };

  const RenderResultElement = ({ item }) => {
    if (multipleSelection) {
      return (
        <div
          className={
            "dropDownElement mb-1 ps-3 text-start" +
            (selectedItem.some((i) => i.id === item.id)
              ? " bg-primary text-white"
              : "")
          }
          onMouseDown={() => handleResultClick(item)}
        >
          <span>{item.name}</span>
          <span className="text-secondary ms-2">{item.tel_Number}</span>
        </div>
      );
    } else {
      return (
        <div
          className="dropDownElement mb-1 ps-3 text-start"
          onMouseDown={() => handleResultClick(item)}
        >
          <span>{item.name}</span>
          <span className="text-secondary ms-2">{item.tel_Number}</span>
        </div>
      );
    }
  };

  return (
    <div {...props} style={{ position: "relative", height: "2rem" }}>
      <Input
        className={
          "rounded-2 ps-3 searchDropDown " +
          (isOpened ? "searchDropDownOpened" : "")
        }
        onBlur={() => {
          !multipleSelection && closeResults();
        }}
        placeholder={inputPlaceholder}
        style={{ width: inputWidth }}
        onClick={() =>
          multipleSelection ? setIsOpened(!isOpened) : setIsOpened(true)
        }
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      ></Input>
      {console.log(items.status)}
      {isOpened && (
        <div className="dropDown pt-1 rounded-2" style={{ width: inputWidth }}>
          {isLoading ? (
            <div className="text-start ps-3">
              {/* <Spinner color="primary" size="sm" className="ms-3"></Spinner> */}
              <Icon icon="line-md:loading-loop" fontSize="1.5rem"></Icon>
              <span className="ps-1 p-0 m-0 fst-italic greyText">Loading</span>
            </div>
          ) : !items.data ? (
            <span className="text-start ps-3 pb-2 fst-italic greyText d-block ">
              No result
            </span>
          ) : (
            items.data &&
            items.data.length > 0 &&
            items.data.map((item) => (
              <RenderResultElement
                key={item.id}
                item={item}
              ></RenderResultElement>
            ))
          )}
        </div>
      )}
    </div>
  );
}
