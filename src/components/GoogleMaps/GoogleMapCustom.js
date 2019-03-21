import React from "react";
import ReactDOM from "react-dom";
import { compose, withProps } from "recompose";
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker
} from "react-google-maps";

export const GoogleMapCustom = compose(
  withScriptjs,
  withGoogleMap
)(props => (
  <GoogleMap {...props } defaultZoom={14} defaultCenter={props.location}>
      <Marker position={props.location} />
  </GoogleMap>
));
