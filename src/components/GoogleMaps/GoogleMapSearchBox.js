import React from "react";
import {SearchBoxGoogleMap} from "./SearchBoxGoogleMap";
import {GoogleMapCustom} from "./GoogleMapCustom";
import {GOOGLE_APIs} from "./Constants";

const mapDefaultConfig = {
  /**
   * Note: create and replace your own key in the Google console.
   * https://console.developers.google.com/apis/dashboard
   * The key "AIzaSyBkNaAGLEVq0YLQMi-PYEMabFeREadYe1Q" can be ONLY used in this sandbox (no forked).
   */
  googleMapURL: GOOGLE_APIs.api_map,
  loadingElement: <div style={{ height: `100%` }} />,
  containerElement: <div style={{ height: `400px`, boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)` }} />,
  mapElement: <div style={{ height: `100%` }} />
};

export class GoogleMapSearchBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      location: props.location,
      toggleMap: true
    }
  }

  /*componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.location.lat !== this.props.location.lat) {
      console.log(nextProps.location);
      this.setState({location: nextProps.location, toggleMap: false});
      setTimeout(() => {
        this.setState({ toggleMap: true });
      }, 50);
    }
  }*/

  onClickMap = e => {
    const { onChangeLocation } = this.props;
    let latitude = e.latLng.lat();
    let longtitude = e.latLng.lng();
    this.setState({location: { ...this.state.locale, lat: latitude, lng: longtitude}});
    onChangeLocation(latitude, longtitude);
  };

  onChangeSearchBox = (places) => {
    const { onChangeLocation } = this.props;
    if (places[0]) {
      const { place_id, formatted_address, geometry: { location } } = places[0];

      this.setState({toggleMap: false, location: { lat: location.lat(), lng: location.lng()}});
      setTimeout(() => {
        this.setState({ toggleMap: true });
      }, 100);
      onChangeLocation(location.lat(), location.lng(), formatted_address);
    }
  }

  render() {
    const { onChangeLocation, disabled } = this.props;
    const { location, toggleMap } = this.state;
    return (
      <div>
        { !disabled && <SearchBoxGoogleMap onChangeSearchBox={this.onChangeSearchBox}/>}
        {toggleMap && <GoogleMapCustom {...mapDefaultConfig} onClick={!disabled ? this.onClickMap : () => {}} location={location}/>}
      </div>
    );
  }
};

GoogleMapSearchBox.defaultProps = {
  onChangeLocation: f => f
}
