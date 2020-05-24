import React from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
import Map from './components/map';
import { screen } from '@testing-library/react';

const styles = {
  default: null,
  hide: [
    {
      featureType: 'poi.business',
      stylers: [{visibility: 'off'}]
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{visibility: 'off'}]
    }
  ]
};

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      events : [],
      markers : [],
      filtered : [],
      map:null,
      polygon: null,
      showMarkers: false,
      selectedOption: 'show-poi',
      query:'',
      locations: [
        {title:"The Ancient Theatre of Philippopolis", location:{lat: 42.146839,lng: 24.751006}},
        {title:"The Ancient Stadium of Philippopolis", location:{lat: 42.147568,lng: 24.748018}},
        {title:"The Ancient Roman Forum of Philippopolis", location:{lat: 42.142111,lng: 24.750944}},
        {title:"Bishop's Basilica of Philippopolis", location:{lat: 42.144118,lng: 24.752732}},
        {title:"Small Basilica of Philippopolis", location:{lat: 42.146448,lng: 24.757944}},
        {title:"Old Town Plovdiv - Architectural-History Reserve ", location:{lat: 42.149824,lng: 24.752665}},
      ]
    }
  }

componentDidMount(){
  this.renderMap();
}

renderMap = () => {
  const url = "https://maps.googleapis.com/maps/api/js?libraries=drawing,geometry&key=AIzaSyC9vNXWd1DKH8x5EQwAaY8wx_m-L0jMKDo&callback=initMap"
  loadScript(url);
  window.initMap = this.initMap;
}
displayMarkers = (map) => {
  const that = this;
  const markers = [];
  const {locations, showMarkers } = this.state;
  const largeInfoWindow = new window.google.maps.InfoWindow();
  const bounds = new window.google.maps.LatLngBounds();
  const defaultIcon = this.makeMarkerIcon('0091ff');
  const highlightedIcon = this.makeMarkerIcon('FFFF24');
  locations.map((el, index) => {
    const position = el.location;
    const title = el.title;
    const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: title,
      id:index,
      animation: window.google.maps.Animation.DROP,
      icon: defaultIcon
    });
    markers.push(marker);
    bounds.extend(marker.position);
    marker.addListener('click', function(){
      that.populateInfoWindow(this, largeInfoWindow, map);
    });
    marker.addListener('mouseover', function(){
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function(){
      this.setIcon(defaultIcon);
    })
  });

  this.setState({markers});
  map.fitBounds(bounds);
}

makeMarkerIcon = (markerColor) => {
  const markerImage = new window.google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new window.google.maps.Size(21, 34),
    new window.google.maps.Point(0, 0),
    new window.google.maps.Point(10, 34),
    new window.google.maps.Size(21,34));
  return markerImage;
}
initMap = () => {
  const map = new window.google.maps.Map(document.getElementById('map'), {
    center: {lat: 42.146839, lng: 24.751006},
    zoom: 14,
    mapTypeControl:false
  });
  this.displayMarkers(map);
  this.setState({
    map
  })
  const drawingManager = new window.google.maps.drawing.DrawingManager({
    drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: window.google.maps.ControlPosition.TOP_CENTER,
      drawingModes: [
        window.google.maps.drawing.OverlayType.POLYGON
      ]
    }
  });
  // Apply new JSON when the user chooses to hide/show features.
  document.getElementById('hide-poi').addEventListener('click', function() {
    map.setOptions({styles: styles['hide']});
  });
  document.getElementById('show-poi').addEventListener('click', function() {
    map.setOptions({styles: styles['default']});
  });
  document.getElementById('toggle-drawing').addEventListener('click', () => {
    this.toggleDrawing(drawingManager, map)
  })

  drawingManager.addListener('overlaycomplete', (event) => {
    let { polygon } = this.state;
    if(polygon){
      this.setState({
        polygon: null
      });
      this.clickHideMarker(); 
    }
    drawingManager.setDrawingMode(null);
    polygon = event.overlay;
    polygon.setEditable(true);
    this.setState({
      polygon
    })
    this.searchWithinPolygon();
    polygon.getPath().addListener('set_at', this.searchWithinPolygon);
    polygon.getPath().addListener('insert_at', this.searchWithinPolygon);
  })
 }

 searchWithinPolygon = () => {
   const { markers, polygon, map } = this.state;
   markers.map((marker,index) => {
    if(window.google.maps.geometry.poly.containsLocation(marker.position, polygon)){
      marker.setVisible(true);
    } else {
      marker.setVisible(false);
    }
   })
 }

 populateInfoWindow = (marker,infowindow, map) => {
  if(infowindow.marker !== marker){
    infowindow.marker = marker;
    infowindow.addListener('closeclick', function() {
      infowindow.content = null;
    });
    const streetViewService = new window.google.maps.StreetViewService();
    const radius = 50;

    function getStreetView(data, status) {
      if (status == window.google.maps.StreetViewStatus.OK) {
        const nearStreetViewLocation = data.location.latLng;
        const heading = window.google.maps.geometry.spherical.computeHeading(
          nearStreetViewLocation, marker.position);
          infowindow.setContent('<div style="width:300px;height:30px">' + marker.title + '</div><div style="width:300px;height:200px"id="pano"></div>');
          const panoramaOptions = {
            position: nearStreetViewLocation,
            pov: {
              heading: heading,
              pitch: 30
            },
            motionTrackingControlOptions: {
              position: window.google.maps.ControlPosition.LEFT_BOTTOM
            }
          };
        const panorama = new window.google.maps.StreetViewPanorama(
          document.getElementById('pano'), panoramaOptions);
      } else {
        infowindow.setContent('<div>' + marker.title + '</div>' +
          '<div>No Street View Found</div>');
      }
    }
    streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
    infowindow.open(map, marker);
  }
}

openNav() {
    document.getElementById("mySidenav").style.width = "250px";
}
  
closeNav() {
    document.getElementById("mySidenav").style.width = "0";
}

selectPOI = (event) =>{
  this.setState({
    selectedOption: event.target.value
  })
}

clickShowMarker = () => {
  let {showMarkers, markers} = this.state;
  showMarkers = true
  markers.forEach((marker) => {
    marker.setVisible(true)
  });
  this.setState({
    showMarkers,
    markers
  });
}

clickHideMarker = () => {
  let {showMarkers, markers} = this.state;
  showMarkers = false;
  markers.forEach((marker) => {
    marker.setVisible(false)
  });
  this.setState({
    showMarkers,
    markers
  });
}

toggleDrawing = (drawingManager, map) => {  
  const { polygon } = this.state;
  if(drawingManager.map){
    drawingManager.setMap(null);
    if(polygon){
      polygon.setMap(null)
    }
  } else {
    drawingManager.setMap(map)
  }
}
  render(){
    return (
      <div className="App">
        <Header openNav={this.openNav}/>
        <Sidebar 
          showMarkers={this.clickShowMarker}
          hideMarkers={this.clickHideMarker}
          markers={this.state.markers}
          closeNav={this.closeNav}
        />
        <div id="style-selector-control" className="map-control">
          <input type="radio" name="show-hide" id="hide-poi" value="hide-poi" onChange={this.selectPOI}
              className="selector-control" checked={this.state.selectedOption === "hide-poi"}/>
          <label htmlFor="hide-poi">Hide Businesses</label>
          <input type="radio" name="show-hide" id="show-poi" value="show-poi" onChange={this.selectPOI}
              className="selector-control" checked={this.state.selectedOption === 'show-poi'}/>
          <label htmlFor="show-poi">Show Businesses</label>
        </div>
        <div id ='map'
            aria-label="map" 
            role = 'application'
        ></div>
        <Footer/>
      </div>
      
    );
  }
  
}

// taken from https://github.com/ines2508/Map
function loadScript(url) {
  const [index] = window.document.getElementsByTagName('script');
  const script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
