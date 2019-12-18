import React, { useState } from "react";
import Helmet from "react-helmet";
import { GeoJSON } from "react-leaflet";

import Layout from "components/Layout";
import Container from "components/Container";
import Map from "components/Map";

import { congressional } from "../data/congressional.js";
import { counties } from "../data/counties.js";
import { outline } from "../data/outline.js";
import { states } from "../data/states.js";
import { CENTER, DEFAULT_ZOOM, mapColors } from "../lib/mapConstants";

const IndexPage = () => {
  const [geoJSONData, setgeoJSONData] = useState({
    congressional: false,
    states: false,
    counties: false,
    outline: false
  });

  const mapSettings = {
    center: CENTER,
    defaultBaseMap: "OpenStreetMap",
    zoom: DEFAULT_ZOOM
  };

  const handleChange = event => {
    const newState = { [event.target.value]: event.target.checked };

    setgeoJSONData(prevState => ({ ...prevState, ...newState }));
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
