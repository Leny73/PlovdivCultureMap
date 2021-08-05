import React from 'react'

const Header = (props) => {
    const { selectedOption, selectPOI, openNav } = props;
    return (
        <header>
        <span style={{fontSize:"30px",cursor:"pointer",float:"left",margin:"20px",}} tabIndex="0" onClick={openNav} onKeyPress={openNav} role="button" aria-pressed="false" aria-labelledby="menubutton">&#9776;</span>
        <h1>Plovdiv Culture Map</h1>
        <div id="style-selector-control" className="map-control">
          <input type="radio" tabIndex="0" name="hide" id="hide-poi" value="hide-poi" onChange={selectPOI}
              className="selector-control" checked={selectedOption === "hide-poi"}/>
          <label htmlFor="hide-poi">Hide Businesses</label>
          <input type="radio" tabIndex="0" name="show" id="show-poi" value="show-poi" onChange={selectPOI}
              className="selector-control" checked={selectedOption === 'show-poi'}/>
          <label htmlFor="show-poi">Show Businesses</label>
        </div>
        </header>
        
    )
}

export default Header