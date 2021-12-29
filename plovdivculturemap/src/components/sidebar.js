import React, { useState} from 'react'
import { CLIENT_ID, CLIENT_SECRET } from '../environments/environment-prod'
const Sidebar = (props) => {
    const { 
        populateInfoWindow,
        map,
        infoWindow
    } = props;
    const [listValue, setListValue] = useState('');
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [fourSquareVenue, setFourSquareVenue] = useState(null)
    const [fourSquarePhotoURL, setFourSquarePhotoURL] = useState(null)
    const changeListView = async (event) => {
        const value = event.target.value;
        setListValue(value);
        const [marker] = props.markers.filter(el => el.title === value);
        setSelectedMarker(marker);
        populateInfoWindow(marker, infoWindow, map);
        
        const location = await fetch(`https://api.foursquare.com/v2/venues/search?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190425&limit=1&ll=${marker.position.lat()},${marker.position.lng()}`).catch(function(error) {
            console.log(error);
            alert(`Error while requesting a venue from Foursquare API. ${error}`)
        });
        const fourSquareLocation = await location.json();
        const { response: { venues } } = fourSquareLocation;
        const [venue] = venues;
        setFourSquareVenue(venue)
        const pictureVenue = await fetch(`https://api.foursquare.com/v2/venues/${venue.id}/photos?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&v=20190425&limit=1`).catch(function(error) {
            console.log(error);
            alert(`Error while requesting a picture from Foursquare API. ${error}`)
        });
        const picture = await pictureVenue.json();
        const { response: { photos: { items } } } = picture;
        const [photo] = items;
        const url = `${photo?.prefix}300x500${photo?.suffix}`
        setFourSquarePhotoURL(url ? url : null)
    }
    // TO DO: Add search functionality 

    // const [searchTerm, setSearchTerm] = useState("");
    // const handleChange = event => {
    //   setSearchTerm(event.target.value);
    // };

    // useEffect(() => {
    //     const results = people.filter(person =>
    //         person.toLowerCase().includes(searchTerm)
    //       );
    //       const [marker] = props.markers.filter(el => el.title === value);
    //       setSelectedMarker(marker);
    //       populateInfoWindow(marker, infoWindow, map);
    //       setSearchResults(results);
    // }, [searchTerm])

    return (
    <div id="mySidenav" className="sidenav">
        <a role="button" tabIndex="0" aria-pressed="false" className="closebtn" onClick={props.closeNav}>&times;</a>
        <div>
            <button tabIndex="0" className="showbtn" onClick={props.showMarkers}>Show Locations</button>
            <button tabIndex="0" className="showbtn" onClick={props.hideMarkers}>Hide Locations</button>
        </div>
 
        <hr></hr>
        <br></br>
        {/* <input id="toggle-drawing" type="button" value="Drawing Tools"/> */}
        <label htmlFor="search">Select Location</label>
        <br></br>
        <select id="list-view" tabIndex="0" onChange={changeListView} value={listValue}>
            <option value="" defaultValue="" disabled hidden>Choose here</option>
            {props.markers.map((el,idx) => <option key={idx} value={el.title}>{el.title}</option>)}
        </select>
        {selectedMarker && <div id="selectedMarker">
            <h3>{selectedMarker.title}</h3>
            <div role="complementary" id="opening-info" style={{textAlign: 'center'}}>
                <div role="contentinfo">{fourSquareVenue?.categories[0]?.name}</div>
                <div role="contentinfo">{fourSquareVenue?.location.address}</div>
                {fourSquarePhotoURL ? <img alt={`${fourSquareVenue?.location.name}`} src={fourSquarePhotoURL}/> : <div></div>}
            </div>
        </div>}
    </div>
    )
}

export default Sidebar