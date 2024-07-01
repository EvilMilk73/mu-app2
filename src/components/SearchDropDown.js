import React, { useState, useEffect } from "react";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu,
  Input,
} from "reactstrap";
import "./SearchDropDown.css";
export default function SearchDropDown({
  items,
  setSelectedItemId,
  selectedItemId,
  isValid,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(
    items.find((i) => i.id === selectedItemId)?.name || ""
  );
  const [validInput, setValidInput] = useState(true);
  
  
  useEffect(() => {
    if (items.find((i) => i.name === query)) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
    }

    const queriedItem = items.find((i) => i.name === query);
   
    if (queriedItem) {
      setSelectedItemId(queriedItem.id);
      setValidInput(true);
      isValid.current = true;
    } else {
      setSelectedItemId(-1);
      setValidInput(false);
      isValid.current = false;
    }
  }, [query, items]);
  useEffect(() => {
    if(selectedItemId === -1) setQuery("");
  }, [selectedItemId]);    // if there is no selected items (id=-1) clear search query

  const itemSelectClickHandle = (item) => {
    setSelectedItemId(item.id);
    setQuery(findItemById(item.id)?.name || "");
    setIsOpen(false);
  };

  const findItemById = (id) => items.find((i) => i.id === id);

  const queryHandler = (item) => Boolean(item.name.includes(query));

  const RenderQueriedList = () => {
    const filteredItems = items.filter((item) => queryHandler(item));

    if (filteredItems.length > 0) {
      return (
        <DropdownMenu>
          {filteredItems.map((item, index) => (
            <DropdownItem
              onClick={() => itemSelectClickHandle(item)}
              key={index}
            >
              {item.name}
            </DropdownItem>
          ))}
        </DropdownMenu>
      );
    } else {
      return (
        <DropdownMenu>
          <DropdownItem className="text-muted" disabled={true}>
            нічого не знайдено
          </DropdownItem>
        </DropdownMenu>
      );
    }
  };

  return (
    <Dropdown
      toggle={() => setIsOpen(!isOpen)}
      isOpen={isOpen}
      className="m-0 p-0"
    >
      <DropdownToggle className="p-0 border-0 w-100" style={{position: "absolute" }}>
        <Input
          className="bg-transparen border-0 rounded-0 Input p-0"
          invalid={!validInput}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="search"
        />
      </DropdownToggle>

      <RenderQueriedList />
    </Dropdown>
  );
}
