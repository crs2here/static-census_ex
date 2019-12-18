import React from "react";
import PropTypes from "prop-types";
import { Map as BaseMap, TileLayer, ZoomControl } from "react-leaflet";

import { useConfigureLeaflet, useMapServices } from "hooks";
import { isDomAvailable } from "lib/util";

const Map = props => {
  const {
    children,
    className,
    defaultBaseMap = "OpenStreetMap",
    ...rest
  } = props;

  useConfigureLeaflet();

  const services = useMapServices({
    names: ["OpenStreetMap"]
  });
  const basemap = services.find(service => service.name === defaultBaseMap);

  let mapClassName = `map`;

  if (className) {
    mapClassName = `${mapClassName} ${className}`;
  }

  if (!isDomAvailable()) {
    return (
      <div className={mapClassName}>
        <p className="map-loading">Loading map...</p>
      </div>
    );
  }

  const mapSettings = {
    className: "map-base",
    zoomControl: false,
    ...rest
  };
  if (typeof window !== "undefined") {
    return (
      <div className={mapClassName}>
        <BaseMap {...mapSettings}>
          {children}
          {basemap && <TileLayer {...basemap} />}
          <ZoomControl position="bottomright" />
        </BaseMap>
      </div>
    );
  }
  return null;
};

Map.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  defaultBaseMap: PropTypes.string,
  mapEffect: PropTypes.func
};

export default Map;
