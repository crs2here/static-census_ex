import React, { useState } from "react";
import Helmet from "react-helmet";
import { GeoJSON, Marker, Popup } from "react-leaflet";

import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";

import { congressional } from "../data/congressional.js";
import { counties } from "../data/counties.js";
import { outline } from "../data/outline.js";
import { states } from "../data/states.js";
import {
  CENTER,
  DEFAULT_ZOOM,
  mapColors,
  censusAPIKEY
} from "../lib/mapConstants";

const MyMarker = props => {
  const initMarker = ref => {
    if (ref) {
      ref.leafletElement.openPopup();
    }
  };

  return <Marker ref={initMarker} {...props} />;
};

const IndexPage = () => {
  const [geoJSONData, setgeoJSONData] = useState({
    congressional: false,
    states: false,
    counties: false,
    outline: false
  });

  const [currentPos, setCurrentPos] = useState(null);
  const [languages, setLanguages] = useState(null);

  const handleChange = event => {
    const newState = { [event.target.value]: event.target.checked };

    setgeoJSONData(prevState => ({ ...prevState, ...newState }));
  };

  const handleMapClick = async event => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const getCoordData = await fetch(
        `https://geo.fcc.gov/api/census/area?lat=${event.latlng.lat}8&lon=${event.latlng.lng}&format=json`,
        requestOptions
      );
      const getCoordDataResponse = await getCoordData.json();

      const stateCode = getCoordDataResponse.results[0].state_fips;
      const countyCode = getCoordDataResponse.results[0].county_fips;

      const censusDataUrl =
        geoJSONData.counties && !geoJSONData.states
          ? `https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=county:${countyCode}:*&LAN=625&key=${censusAPIKEY}`
          : `https://api.census.gov/data/2013/language?get=EST,LANLABEL,NAME&for=county:${countyCode}:*&in=state:${stateCode}&LAN=625&key=${censusAPIKEY}`;

      const censusData = await fetch(censusDataUrl, requestOptions);

      const censusResponse = await censusData.text();

      setCurrentPos(event.latlng);
      setLanguages(censusResponse);
    } catch (error) {
      setCurrentPos(event.latlng);
      console.info(error);
    }
  };

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM,
    onClick: handleMapClick
  };

  const CBInput = ({ checked, name }) => (
    <label style={mapColors[name]}>
      {name}
      <input
        style={{ width: "15%" }}
        checked={checked}
        name={name}
        value={name}
        type="checkbox"
        id={name}
        onChange={handleChange}
      />
    </label>
  );

  return (
    <Layout pageName="home">
      <Helmet>
        <title>geojson</title>
      </Helmet>

      <Map {...mapSettings}>
        {geoJSONData.congressional && (
          <GeoJSON style={mapColors.congressional} data={congressional.data} />
        )}
        {geoJSONData.states && (
          <GeoJSON style={mapColors.states} data={states.data} />
        )}
        {geoJSONData.counties && (
          <GeoJSON style={mapColors.counties} data={counties.data} />
        )}
        {geoJSONData.outline && (
          <GeoJSON style={mapColors.outline} data={outline.data} />
        )}
        {currentPos && (
          <MyMarker position={currentPos}>
            <Popup style={{ width: "600px" }} position={currentPos}>
              {/* will put lang dets here */}
              Current location: <pre>{JSON.stringify(currentPos, null, 2)}</pre>
              {languages}
            </Popup>
          </MyMarker>
        )}
      </Map>

      <Container type="content" className="home-start">
        <CBInput checked={geoJSONData.congressional} name={"congressional"} />
        <CBInput checked={geoJSONData.states} name={"states"} />
        <CBInput checked={geoJSONData.counties} name={"counties"} />
        <CBInput checked={geoJSONData.outline} name={"outline"} />
      </Container>
    </Layout>
  );
};

export default IndexPage;


api.census.gov/data/2013/language?get=EST,LANLABEL,LAN7,NAME&for=state:04&key=07184eefd1a00d366cfafb4b523927428fec0a52
