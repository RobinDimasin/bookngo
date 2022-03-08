import { FC, useCallback, useEffect, useState } from "react";

import ReactMapboxGl, { Marker, Cluster } from "react-mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

import styles from "../styles/MapInput.module.css";

const Map = ReactMapboxGl({
  accessToken:
    "pk.eyJ1Ijoicm9iaW5waCIsImEiOiJjbDBmcHZqZWcwdjdnM2pwY2JiY2cxeGtlIn0.GOX-8EcihWjo-KhsBCh9Kg",
});

function debounce_leading(func: (...args: any[]) => void, timeout = 300) {
  let timer: NodeJS.Timeout | undefined;
  return (...args: any[]) => {
    if (!timer) {
      // @ts-ignore
      func.apply(this, args);
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}

const MapInput: FC<{
  coordinate?: {
    lng: number;
    lat: number;
  };
  onChange?: (coords: { lat: number; lng: number }) => void;
  hasCrosshair?: boolean;
  fixedMarkers?: {
    lat: number;
    lng: number;
    color: string;
    label?: string;
  }[];
}> = ({
  coordinate = {
    lng: 120.9758997,
    lat: 14.5799875,
  },
  onChange = () => {},
  hasCrosshair = false,
  fixedMarkers = [],
}) => {
  const [coords, setCoords] = useState(coordinate);

  useEffect(() => {
    if (hasCrosshair) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setCoords({
          lat,
          lng,
        });
      });
    }
  }, []);

  const onMoveHandler = debounce_leading((map: mapboxgl.Map) => {
    const coords = {
      lat: map.getCenter().lat,
      lng: map.getCenter().lng,
    };

    setCoords(coords);

    onChange(coords);
  }, 1000 / 144);

  const clusterMarker = (coordinates: [number, number]) => (
    <Marker coordinates={coordinates} anchor="bottom">
      <div
        className={styles.marker}
        {...{ "text-value": "Pick Up / Drop Off" }}
      />
    </Marker>
  );

  return (
    <>
      <Map
        style="mapbox://styles/mapbox/streets-v9"
        containerStyle={{
          height: "50vh",
          width: "50%",
          margin: "auto",
        }}
        center={[coords.lng, coords.lat]}
        onMove={onMoveHandler}
      >
        {hasCrosshair ? (
          <Marker coordinates={[coords.lng, coords.lat]} anchor="bottom">
            <div className={styles.marker} {...{ "text-value": "+" }} />
          </Marker>
        ) : (
          <></>
        )}

        <Cluster ClusterMarkerFactory={clusterMarker}>
          {fixedMarkers.map(({ lat, lng, color, label }, key) => (
            <Marker key={key} coordinates={[lng, lat]}>
              <div
                className={styles.marker}
                style={{
                  color,
                }}
                {...{ "text-value": label }}
              />
            </Marker>
          ))}
        </Cluster>
      </Map>
    </>
  );
};

export default MapInput;
