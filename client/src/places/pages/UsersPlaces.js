import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import PlaceList from "../components/PlaceList";
import { useHttpClient } from "../../shared/hooks/http-hook";

import Button from "../../shared/components/FormElements/Button";

import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UsersPlaces = () => {
  const [loadedPlaces, setLoadedPlaces] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const userId = useParams().userId;
  console.log(userId);

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/places/user/${userId}`
        );
        setLoadedPlaces(responseData.places);
        console.log(responseData.places);
      } catch (error) {}
    };

    fetchPlaces();
  }, [sendRequest, userId]);

  const placeDeletedHandler = (deletedPlaceId) => {
    setLoadedPlaces((prevPlaces) =>
      prevPlaces.filter((place) => place.id !== deletedPlaceId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlaces && (
        <PlaceList items={loadedPlaces} onDeletePlace={placeDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default UsersPlaces;
