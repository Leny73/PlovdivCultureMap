import React from 'react';
import './App.css';

import Header from './components/header';
import Footer from './components/footer';
import Sidebar from './components/sidebar';
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
      ],
      placeMarkers: []
    }
  }

async componentDidMount(){
  this.renderMap();
}

renderMap = () => {
  const url = "https://maps.googleapis.com/maps/api/js?libraries=places,drawing,geometry&key=AIzaSyC9vNXWd1DKH8x5EQwAaY8wx_m-L0jMKDo&callback=initMap"
  loadScript(url);
  window.initMap = this.initMap;
  window.displayDirections = this.displayDirections;
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

  this.setState({markers, largeInfoWindow});
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
  const that = this;
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
  // document.getElementById('toggle-drawing').addEventListener('click', () => {
  //   this.toggleDrawing(drawingManager, map)
  // })

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
  });
  

  //Unused functionality could be implemented

  
  // document.getElementById('zoom-to-area').addEventListener('click', () => {
  //   this.zoomToArea(map)
  // });

  // document.getElementById('search-within-time').addEventListener('click', () => {
  //   this.searchWithinTime(map);
  // });

  //const autoComplete = new window.google.maps.places.Autocomplete(document.getElementById('search-within-time-text'));
  // const searchBox = new window.google.maps.places.SearchBox(document.getElementById('places-search'));
  // searchBox.setBounds(map.getBounds());

  // searchBox.addListener('places_changed', function(){
  //   debugger
  //   that.searchBoxPlaces(this);
  // });
  //document.getElementById('go-places').addEventListener('click', this.textSearchPlaces);
 }

 searchBoxPlaces = (searchBox) => {
    this.clickHideMarker();
    const places = searchBox.getPlaces();
    this.createMarkersForPlaces(places);

    if(places.length === 0 ){
      window.alert("We didn't find any matching places for that search")
    }
 }

 createMarkersForPlaces = (places) => {
   const { map, placeMarkers } = this.state;
   const that = this;
   const bounds = new window.google.maps.LatLngBounds();

   places.forEach( (place,idx) => {
     const icon = {
       url: place.icon,
       size: new window.google.maps.Size(35, 35),
       origin: new window.google.maps.Point(0, 0),
       anchor: new window.google.maps.Point(15, 34),
       scaledSize: new window.google.maps.Size(25, 25)
     };
     const placeInfoWindow = new window.google.maps.InfoWindow();
     const marker = new window.google.maps.Marker({
       map,
       icon,
       title: place.name,
       position: place.geometry.location,
       id: place.place_id
     });
     marker.addListener('click', function() {
       if(placeInfoWindow === this) {
        window.alert('This window is already on this marker');
       } else { 
         that.getPlacesDetails(this, placeInfoWindow);
       }
     })
     placeMarkers.push(marker);
     if(place.geometry.viewport){
       bounds.union(place.geometry.viewport);
     } else { 
       bounds.extend(place.geometry.location);
     }
   });
   map.fitBounds(bounds);
   this.setState({
     placeMarkers
   });
 }

 getPlacesDetails(marker, infoWindow){
   const { map } = this.state;
   const service = new window.google.maps.places.PlacesService(map);
   service.getDetails({
     placeId: marker.id
   }, (place, status) => {
     if(status === window.google.maps.places.PlacesServiceStatus.OK){
       infoWindow.marker = marker;
       let innerHtml =  '<div>';
        if(place.name){
          innerHtml += '<strong>' + place.name + '</strong>'
        }
        if(place.formatted_address) {
          innerHtml += '<br>' + place.formatted_address
        }
        if(place.formatted_phone_number) {
          innerHtml += '<br>' + place.formatted_phone_number
        }
        if(place.opening_hours){
          innerHtml +='<br><br><strong>Hours:</strong><br'+
          place.opening_hours.weekday_text[0] + '<br>' +
          place.opening_hours.weekday_text[1] + '<br>' +
          place.opening_hours.weekday_text[2] + '<br>' +
          place.opening_hours.weekday_text[3] + '<br>' +
          place.opening_hours.weekday_text[4] + '<br>' +
          place.opening_hours.weekday_text[5] + '<br>' +
          place.opening_hours.weekday_text[6];
        }
        if(place.photos) {
          innerHtml += '<br><br><img src="' + place.photos[0].getUrl(
            {maxHeight: 100, maxWidth: 200}
          ) + '">'
        }
        innerHtml += '</div>';
        infoWindow.setContent(innerHtml);
        infoWindow.open(map,marker)
        infoWindow.addListener('click', () => {
          infoWindow.marker = null
        });
     }
   })
 }
 textSearchPlaces = () => {
   const { map } = this.state;
   const bounds = map.getBounds();
   this.clickHideMarker();
   const placesService = new window.google.maps.places.PlacesService(map);
   placesService.textSearch({
     query: document.getElementById('places-search').value,
     bounds
   }, (results, status) => {
     if(status === window.google.maps.places.PlacesServiceStatus.OK){
       this.createMarkersForPlaces(results);
     }
   });

 }

 searchWithinTime = (map) => {
   const distantMatrixService = new window.google.maps.DistanceMatrixService;
   const address = document.getElementById('search-within-time-text').value;
   if(address == '') {
     window.alert('You must enter an address');
   } else {
     this.clickHideMarker();
     const { markers } = this.state;
     const origins = [];

    markers.forEach( (el, idx) => {
      origins[idx] = el.position
    });
    const destination = address;
    const mode = document.getElementById('mode').value;
    distantMatrixService.getDistanceMatrix({
      origins,
      destinations: [destination],
      travelMode: window.google.maps.TravelMode[mode],
      unitSystem: window.google.maps.UnitSystem.IMPERIAL
    }, ( response, status ) => {
      if(status !== window.google.maps.DistanceMatrixStatus.OK) {
        window.alert('Error was: '+ status)
      } else {
        this.displayMarkersWithinTime(response, map);
      }
    })
   }
 }

 displayMarkersWithinTime(response, map) {
   const maxDuration = document.getElementById('max-duration').value;
   const origins = response.originAddresses;
   const destinations = response.destinationAddresses;
   const { markers } = this.state;
   let atLeastOne = false;
   origins.forEach( (el,idx) => {
     const results = response.rows[idx].elements;
     results.forEach( (element, index) => {
        if(element.status === "OK") {
          const distanceText = element.distance.text;
          const duration = element.duration.value / 60;
          const durationText = element.duration.text;

          if(duration <= maxDuration){
            markers[idx].setMap(map);
            atLeastOne = true;
            
            const infoWindow = new window.google.maps.InfoWindow({
              content: durationText + ' away,  ' + distanceText +
              '<div><input type=\"button\" value=\"View Route\" onclick='+
              '\"displayDirections(&quot;'+ origins[idx]+  '&quot;);\"></input></div>'
            });

            infoWindow.open(map, markers[idx]);
            markers[idx].infowindow = infoWindow;
            markers[idx].setVisible(true);
            window.google.maps.event.addListener( markers[idx], 'click', function () {
              this.infowindow.close();
            });
          }
        }
     })
   })
 }

 displayDirections = (origin) => {
  this.clickHideMarker();
  const { map } = this.state;
  const directionService = new window.google.maps.DirectionsService();
  const destinationAddress = document.getElementById('search-within-time-text').value;
  const mode = document.getElementById('mode').value;
  directionService.route({
    origin,
    destination: destinationAddress,
    travelMode: window.google.maps.TravelMode[mode]
  }, (response, status) => {
    if(status === window.google.maps.DirectionsStatus.OK){
      const directionsDisplay = new window.google.maps.DirectionsRenderer({
        map,
        directions: response,
        draggable: true,
        polylineOptions:  {
          strokeColor: 'green'
        }
      });
    } else {
      window.alert('Directions request failed due to '+ status);
    }
  })
 }
 zoomToArea = (map) => {
   const geocoder = new window.google.maps.Geocoder();
   const address = document.getElementById('zoom-to-area-text').value;
   if( address === '') {
    window.alert('You must enter an area, or a valid address.')
   } else {
     geocoder.geocode(
       {
         address: address,
         componentRestrictions: {locality: 'Bulgaria'}
       }, (results, status) => {
         if( status === window.google.maps.GeocoderStatus.OK) {
           const [ result ] = results;
           map.setCenter(result.geometry.location);
           map.setZoom(16);
         } else {
           window.alert("We couldn't find that location - try entering more specific one")
         }
       }
     )
   }
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
    document.getElementById("mySidenav").style.width = "350px";
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
        <Header
          openNav={this.openNav}
          selectedOption={this.state.selectedOption}
          selectPOI={this.selectPOI}
          />
        <Sidebar 
          showMarkers={this.clickShowMarker}
          hideMarkers={this.clickHideMarker}
          markers={this.state.markers}
          closeNav={this.closeNav}
          populateInfoWindow={this.populateInfoWindow}
          map={this.state.map}
          infoWindow={this.state.largeInfoWindow}
        />
        <div id ='map'
            aria-label="map" 
            role = 'application'
        ></div>
        <Footer/>
      </div>
      
    );
  }
  
}

// followed a video in youtube about loading scripts in React
function loadScript(url) {
  const [index] = window.document.getElementsByTagName('script');
  const script = window.document.createElement('script');
  script.src = url;
  script.async = true;
  script.defer = true;
  index.parentNode.insertBefore(script, index);
}

export default App;
