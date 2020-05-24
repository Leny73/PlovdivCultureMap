import React from 'react'

const Sidebar = (props) => {
    return (
    <div id="mySidenav" className="sidenav">
        <a className="closebtn" onClick={props.closeNav}>&times;</a>
        <button onClick={props.showMarkers}>Show Locations</button>
        <button onClick={props.hideMarkers}>Hide Locations</button>
        <hr></hr>
        <span className="text">Draw a shape to search within it for Cultural Places</span>
        <br></br>
        <input id="toggle-drawing" type="button" value="Drawing Tools"/>
        {/* <select id="list-view">
            <option value="ancienttheatre">Ancient Theatre of Phillipopolis</option>
            <option value="ancientstadium">Ancient Stadium of Phillipopolis</option>
            <option value="romanforum">Roman Forum of Phillipopolis</option>
            <option value="romanbasilica">Great Basilica of Phillipopolis</option>
        </select> */}
        {/* <input type="search" id="search-input"></input>
        <div id="selectedMarker">
            <h3>Cultural Place</h3>
            <img alt="cultural place"/>
            <div id="opening-info"></div>
        </div> */}
    </div>
    )
}

export default Sidebar