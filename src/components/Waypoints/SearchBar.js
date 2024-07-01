import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { Input, Label, Spinner } from "reactstrap";
import "./SearchBar.css";
import debounce from "lodash/debounce"; //
import * as tt_services from "@tomtom-international/web-sdk-services";
export default function SearchBar({
  inputWidth = "20rem",
  waypointPosition = { lat:48.696728763883385, lon:26.582558500000005}, //TODO: global variable with users/ main waypoint position
  handlePositionChange, //handlePositionChange(position [1,1])
  ...props
}) {
  const [isOpened, setIsOpened] = useState(false);
  const [items, setItems] = useState([]); // {type, streetName, streetNumber, countrySubdivisionName, municipalitySubdivision , position {lat,lon}}
  const [resultState, setResultState] = useState("noQuery"); // Possible vars = 'noQuery', 'loading', 'noResult', 'hasResults'
  const [searchQuery, setSearchQuery] = useState("");

  // useEffect(() => {
  //   // if (items) {
  //   //   setResultState('noResults');
  //   // }
  //   // if(items.length>0) setIsOpened(true);
   
  // }, [searchQuery]);

  const searchResults = (query) => {
    console.log(searchQuery);
    if (query.trim() !== "") {
      const results = tt_services.services.fuzzySearch({
        key: process.env.REACT_APP_TOMTOM_API_KEY,
        query: query.trim(),
        center: waypointPosition,
        radius: 30000,
        maxFuzzyLevel: 3,
        minFuzzyLevel: 1,
        language: "uk-UA",
        typeahead: true,
        idxSet: "PAD,Addr,Str",
      });

      results.then((value) => {
        if (query.trim() !== "") {
          let itemsArr = value.results.map(
            ({
              type,
              position,
              address: {
                streetName,
                streetNumber,
                countrySubdivisionName,
                municipalitySubdivision,
              },
            }) => ({
              type,
              streetName: streetName,
              streetNumber,
              countrySubdivisionName: countrySubdivisionName,
              municipalitySubdivision: municipalitySubdivision,
              position,
            })
          );
          setItems(itemsArr);
          if (itemsArr.length > 0) setResultState("hasResults");
          else setResultState("noResults");
        }
      });
    }
  };
  
  const closeResults = () => {
    setIsOpened(false);
  };


  const debouncedFetchResults = useCallback(
    debounce(
      (query) => {
        searchResults(query);
       
      },
      1000,
    ),
    []
  );

  const handleQuery = (input) => {
    setSearchQuery(input);
    setItems([]);
    if (input.trim() == "") {
      setResultState("noQuery");
      setIsOpened(false);
    } else {
      setIsOpened(true);
      setResultState("loading");
      debouncedFetchResults(input);
      // setItems([
      //   {
      //     type: "test",
      //     streetName: "хаха",
      //     streetNumber: "15",
      //     countrySubdivisionName: "subdiv",
      //     municipalitySubdivision: "gorod",
      //     position: { lng: 1, lat: 1 },
      //   },
      //   {
      //     type: "test2",
      //     streetName: "хахqweа",
      //     countrySubdivisionName: "subdiv",
      //     municipalitySubdivision: "gorod",
      //     position: { lng: 1, lat: 1 },
      //   },
      // ]);
      // setResultState("hasResults");
    }
  };

  const handleResultClick = (item) => {
    let searchResult =item.streetName;
    if(item.streetNumber) searchResult +=  ", "+  item.streetNumber;
    handlePositionChange([
      parseFloat(item.position.lng),
      parseFloat(item.position.lat),
    ],
    searchResult);
    setSearchQuery(searchResult);
    setIsOpened(false);
  };
  const abbriviateText = (text) => {
    if (text) {
      let abbrviations = {
        Вулиця: "Вул.",
        Провулок: "Пров.",
        Область: "Обл.",
        область: "обл.",
      };
      return text
        .split(" ")
        .map((word) => abbrviations[word] || word)
        .join(" ");
    } else {
      return undefined;
    }
  };

  const RenderResultElement = ({ item }) => {
    return (
      <div
        className="ps-2 resultElement"
        onMouseDown={() => handleResultClick(item)}
      >
        <span>{abbriviateText(item.streetName)}</span>
        {item.streetNumber && <span>{", " + item.streetNumber}</span>}

        <div className="greyText">
          {item.countrySubdivisionName && (
            <span>{abbriviateText(item.countrySubdivisionName)}</span>
          )}
          {item.municipalitySubdivision && (
            <span>{", " + abbriviateText(item.municipalitySubdivision)}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div {...props}>
      <div className="inputContainer">
        <Input
          className={
            "searchBar " +
            (isOpened && resultState !== "noQuery" ? "searchBarOpened" : "")
          }
          placeholder="Search point"
          style={{ width: inputWidth }}
          onClick={() => !isOpened && setIsOpened(true)}
          onBlur={closeResults}
          value={searchQuery}
          onChange={(e) => handleQuery(e.target.value)}
        ></Input>
      </div>

      {isOpened && resultState !== "noQuery" && (
        <div className="resultBox pb-1 pt-2" style={{ width: inputWidth }}>
          {resultState === "loading" && (
            <div>
              <Spinner color="primary" size="sm" className="ms-3"></Spinner>
              <Label className="ps-1 fst-italic greyText">Loading</Label>
            </div>
          )}
          {resultState === "noResults" && (
            <Label className="ps-2 fst-italic greyText">No result</Label>
          )}
          {resultState === "hasResults" &&
            items.map((item, index) => (
              <RenderResultElement
                key={index}
                item={item}
              ></RenderResultElement>
            ))}
        </div>
      )}
    </div>
  );
}
