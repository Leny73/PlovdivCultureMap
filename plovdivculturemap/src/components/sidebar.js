import React from 'react'

const Sidebar = (props) => {
    return (
    <div id="mySidenav" className="sidenav">
        <a className="closebtn" onClick={props.closeNav}>&times;</a>
        <button onClick={props.showMarkers}>Show Locations</button>
        <button onClick={props.hideMarkers}>Hide Locations</button>
        <hr></hr>
        {/* <span className="text">Draw a shape to search within it for Cultural Places</span>
        <br></br>
        <input id="toggle-drawing" type="button" value="Drawing Tools"/>
        <hr></hr> */}
        <select id="zoom-to-area-text">
            <option value="пл. Централен">City Center</option>
            <option value="Стария Град">Old Town</option>
            <option value="Youth Hill Plovdiv">Youth hill</option>
            <option value="Паметник на незнайния войн Пловдив">Bunardjik hill</option>
            <option value="Hillock of Fraternity Plovdiv">Hillock of Fraternity</option>
        </select>
        <input id="zoom-to-area" type="button" value="Zoom"/>
        <hr></hr>
            <div>
                <span className="text">Within </span>
                <select id="max-duration">
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="60">60 min</option>
                </select>
                <select id="mode">
                    <option value="DRIVING">Drive</option>
                    <option value="WALKING">Walk</option>
                    <option value="BICYCLING">Bicycle</option>
                    <option value="TRANSIT">Transit ride</option>
                </select>
                <span className="text">of</span>
                <input type="text" id="search-within-time-text" placeholder="Ex: Ancient Theatre"></input>
                <input type="button" value="Find" id="search-within-time"></input>
            </div>
        <hr></hr>
            <div>
                <span className='text'>Search for nearby places </span>
                <input type="text" id="places-search" placeholder="Ex: Pizza delivery"></input>
                <input type="button" value="Go" id="go-places"></input>
            </div>
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