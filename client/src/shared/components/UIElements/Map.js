import React, { useRef, useEffect } from "react";
//useRef is to create references

import "./Map.css";

// The way in which the code is set is breaking the app. I need to use the hook useEffect to make it work

const Map = (props) => {
  const mapRef = useRef();

  // The deconstruction is needed because the object  props can change a lot, so I extract the variables that I need to pass them to the function useEffect
  const { center, zoom } = props;

  useEffect(() => {
    // this is google API syntax
    const map = new window.google.maps.Map(mapRef.current, {
      center: center,
      zoom: zoom
    });

    new window.google.maps.Marker({ position: center, map: map });
  }, [center, zoom]);

  return (
    <div
      ref={mapRef}
      className={`map ${props.className}`}
      style={props.style}
    ></div>
  );
};

export default Map;
