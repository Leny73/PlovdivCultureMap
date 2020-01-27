import React from 'react'

const Header = (props) => {
    return (
        <header>
            <span style={{fontSize:"30px",cursor:"pointer",float:"left",marginLeft:"20px"}} onClick={props.openNav}>&#9776;</span>
        <h1>Plovdiv Culture Map</h1>
        </header>
    )
}

export default Header