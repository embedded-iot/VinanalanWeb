import React from "react";
import ReactDOM from "react-dom";
import {GOOGLE_APIs} from "./Constants";
import {FormattedMessage} from "react-intl";
const { compose, withProps, lifecycle } = require("recompose");
const { withScriptjs } = require("react-google-maps");
const {
  StandaloneSearchBox
} = require("react-google-maps/lib/components/places/StandaloneSearchBox");

const STRINGS = {
  SEARCH_BOX_LOCATION_IN_GOOGLE_MAP: "Tìm kiếm vị trí trên bản đồ"
};

const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: GOOGLE_APIs.api_map,
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />
  }),
  lifecycle({
    componentWillMount() {
      const refs = {};

      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const { onChangeSearchBox } = this.props;
          onChangeSearchBox(places);
          this.setState({
            places
          });
        }
      });
    }
  }),
  withScriptjs
)(props => (
  <div data-standalone-searchbox="">
    <StandaloneSearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder={STRINGS.SEARCH_BOX_LOCATION_IN_GOOGLE_MAP}
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `100%`,
          height: `50px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`
        }}
      />
    </StandaloneSearchBox>
    {/*<ol>
      {props.places.map(
        ({ place_id, formatted_address, geometry: { location } }) => (
          <li key={place_id}>
            {formatted_address}
            {" at "}({location.lat()}, {location.lng()})
          </li>
        )
      )}
    </ol>*/}
  </div>
));


export class SearchBoxGoogleMap extends React.Component {
  render() {
    return (
      <div>
        <PlacesWithStandaloneSearchBox onChangeSearchBox={this.props.onChangeSearchBox }/>
      </div>
    );
  }
}

SearchBoxGoogleMap.defaultProps = {
  onChangeSearchBox: f => f
}
