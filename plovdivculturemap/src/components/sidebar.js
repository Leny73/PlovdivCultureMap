import React, { useState, useEffect } from "react";
import { CLIENT_ID, CLIENT_SECRET } from "../environments/environment-prod";
const Sidebar = (props) => {
  const { populateInfoWindow, map, infoWindow } = props;
  const [listValue, setListValue] = useState("");
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [fourSquareVenue, setFourSquareVenue] = useState(null);
  const [fourSquarePhotoURL, setFourSquarePhotoURL] = useState(null);
  const changeListView = async (value) => {
    setListValue(value);
    const [marker] = props.markers.filter((el) => el.title === value);
    setSelectedMarker(marker);
    populateInfoWindow(marker, infoWindow, map);

    const location = await fetch(
      `https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190425&limit=1&ll=${marker.position.lat()},${marker.position.lng()}`
    ).catch(function (error) {
      console.log(error);
      alert(`Error while requesting a venue from Foursquare API. ${error}`);
    });
    const fourSquareLocation = await location.json();
    const {
      response: { venues },
    } = fourSquareLocation;
    const [venue] = venues;
    setFourSquareVenue(venue);
    const pictureVenue = await fetch(
      `https://api.foursquare.com/v2/venues/${venue.id}/photos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190425&limit=1`,
      { crossDomain: true }
    ).catch(function (error) {
      console.log(error);
      alert(`Error while requesting a picture from Foursquare API. ${error}`);
    });
    const picture = await pictureVenue.json();
    const {
      response: {
        photos: { items },
      },
    } = picture;
    const [photo] = items;
    const url = `${photo?.prefix}300x500${photo?.suffix}`;
    setFourSquarePhotoURL(url ? url : null);
  };

  const [searchTerm, setSearchTerm] = useState("");
  const handleChange = async (event) => {
    event.preventDefault();
    const value = document.getElementById("site-search").value;
    setSearchTerm(value);
    const [result] = props.markers?.filter((marker) => {
      return marker.title.toLowerCase().includes(value);
    });
    await changeListView(result.title);
  };

  useEffect(() => {
    const results = props.markers?.filter((marker) =>
      marker.title.toLowerCase().includes(searchTerm)
    );
    const [marker] = results;

    if (marker) {
      setSelectedMarker(marker);
      populateInfoWindow(marker, infoWindow, map);
    }
  }, [searchTerm]);

  return (
    <div id="mySidenav" className="sidenav">
      <button
        tabIndex="0"
        aria-pressed="false"
        className="closebtn"
        onClick={props.closeNav}
      >
        &times;
      </button>
      <div>
        <button tabIndex="0" className="showbtn" onClick={props.showMarkers}>
          Show Locations
        </button>
        <button tabIndex="0" className="showbtn" onClick={props.hideMarkers}>
          Hide Locations
        </button>
      </div>

      <hr></hr>
      <br></br>
      {/* <input id="toggle-drawing" type="button" value="Drawing Tools"/> */}
      <label tabIndex="0" htmlFor="site-search">
        Search the site:
      </label>
      <br></br>
      <input tabIndex="0" type="search" id="site-search" />
      <button tabIndex="0" onClick={handleChange}>
        Search
      </button>
      <br></br>
      <label htmlFor="search">Select Location</label>
      <br></br>
      <select
        id="list-view"
        tabIndex="0"
        onChange={async (event) => await changeListView(event.target.value)}
        value={listValue}
      >
        <option value="" defaultValue="" disabled hidden>
          Choose here
        </option>
        {props.markers.map((el, idx) => (
          <option key={idx} value={el.title}>
            {el.title}
          </option>
        ))}
      </select>
      {selectedMarker && (
        <div id="selectedMarker">
          <h3>{selectedMarker.title}</h3>
          <div
            role="complementary"
            id="opening-info"
            style={{ textAlign: "center" }}
          >
            <div role="contentinfo">{fourSquareVenue?.categories[0]?.name}</div>
            <div role="contentinfo">{fourSquareVenue?.location.address}</div>
            {fourSquarePhotoURL ? (
              <img
                alt={`${fourSquareVenue?.location.name}`}
                src={fourSquarePhotoURL}
              />
            ) : (
              <div></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
