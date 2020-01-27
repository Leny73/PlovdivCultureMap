import React from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import Map from './components/map';


class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      events : [],
      markers : [],
      filtered : [],
      showMarkers: true,
      query:''
    }
  }

componentDidMount(){
  this.APIKey = "";
  this.URL = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyC9vNXWd1DKH8x5EQwAaY8wx_m-L0jMKDo&callback=initMap';
  this.loadScript(this.URL);
  window.initMap = this.initMap;
}

initMap = () => {
  let map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: 41.390205, lng: 2.154007},
    zoom: 14
  });

  let boundries = new window.google.maps.LatLngBounds();

  
  map.fitBounds(boundries);
}
loadScript(src) {
  let googleScriptTag = window.document.createElement('script'),
      body = window.document.getElementsByTagName('body')[0];

  googleScriptTag.async = true;
  googleScriptTag.defer = true;
  googleScriptTag.src = src;
  googleScriptTag.type = "text/javascript"
  body.appendChild(googleScriptTag);

      // Taken from https://stackoverflow.com/questions/49851104/how-to-load-script-in-react-component
}
openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
  
closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

clickShowMarker = () => {
  let {showMarkers} = this.state;

  showMarkers = !showMarkers;

  this.setState({
    showMarkers
  });

}
  render(){
    return (
      <div className="App">
        <Header openNav={this.openNav}/>
        <Sidebar 
          showMarkers={this.state.showMarkers}
          closeNav={this.closeNav}
        />
        <Map/>
        <Footer/>
      </div>
    );
  }
  
}

export default App;
