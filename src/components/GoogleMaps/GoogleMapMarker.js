import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";


const mapDefaultConfig = {
    /**
     * Note: create and replace your own key in the Google console.
     * https://console.developers.google.com/apis/dashboard
     * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
     */
    googleMapURL:
      "https://maps.googleapis.com/maps/api/js?key=AIzaSyDTeJcK4YpgCIbBhJBvJDlSWMBTDi17hRM&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />
};

const GoogleMapCustom = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap {...props } defaultZoom={8} defaultCenter={props.location}>
      <Marker position={props.location} />
  </GoogleMap>
));

export class GoogleMapMarker extends React.Component {

  onClickMap = e => {
    const { onClickMap } = this.props;
    let latitude = e.latLng.lat();
    let longtitude = e.latLng.lng();
    onClickMap(latitude, longtitude);
  };

  render() {
    const { location, onClickMap } = this.props;
    return (
      <div>
        <GoogleMapCustom {...mapDefaultConfig} onClick={this.onClickMap} location={location}/>
      </div>
    );
  }
};

GoogleMapMarker.defaultProps = {
  onClickMap: f => f,
  location: {}
}

