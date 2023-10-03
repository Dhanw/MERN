import React from "react";
import { useParams } from "react-router-dom";

import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import {
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../shared/hooks/form-hook";
import "./PlaceForm.css";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State",
    description: "one of the most famout Skycrapers of all time",
    imageUrl:
      "https://media.istockphoto.com/id/496799869/es/foto/el-edificio-empire-state.jpg?s=1024x1024&w=is&k=20&c=VnfXeECkcuZcd-hKD5dVIXkhO2NTaPLQiMqduqoFAjk=",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882393,
    },
    creator: "u1",
  },

  {
    id: "p2",
    title: "Empire State",
    description: "one of the most famout Skycrapers of all time",
    imageUrl:
      "https://media.istockphoto.com/id/496799869/es/foto/el-edificio-empire-state.jpg?s=1024x1024&w=is&k=20&c=VnfXeECkcuZcd-hKD5dVIXkhO2NTaPLQiMqduqoFAjk=",
    address: "20 W 34th St., New York, NY 10001, United States",
    location: {
      lat: 40.7484445,
      lng: -73.9882393,
    },
    creator: "u2",
  },

  {
    id: "p3",
    title: "Colosseum ",
    description: "The Colosseum - A Timeless Marvel of Ancient Rome!",
    imageUrl:
      "https://media.istockphoto.com/id/622806180/es/foto/coliseo-de-roma-al-anochecer.jpg?s=1024x1024&w=is&k=20&c=4IOhIyqTCiZQyOsrjSsOf45en2KYr1PYypdvYUawsQQ=",
    address: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
    location: {
      lat: 41.8902142,
      lng: 12.489656,
    },
    creator: "u1",
  },
];

// need to be carefully in the order that I initialize the functions

const UpdatePlace = () => {
  const placeId = useParams().placeId;
  const identifiedPlaced = DUMMY_PLACES.find((p) => p.id === placeId);
  const [formState, inputHandler] = useForm(
    {
      title: {
        value: identifiedPlaced.title,
        isValid: true,
      },
      description: {
        value: identifiedPlaced.description,
        isValid: true,
      }
    },
    true
  );

  const placeUpdateSubmitHandler = (event) => {
    event.preventDefault();
    console.log(formState.inputs);
  };

  if (!identifiedPlaced) {
    return (
      <div className="center">
        <h2>Could not find the place</h2>
      </div>
    );
  }
  return (
    <form className="place-form" onSubmit={placeUpdateSubmitHandler}>
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        initialValue={formState.inputs.title.value}
        initialValid={formState.inputs.title.isValid}
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description min 5 ."
        onInput={inputHandler}
        initialValue={formState.inputs.description.value}
        initialValid={formState.inputs.description.isValid}
      />
      <Button type="submit" disabled={!formState.isValid}>
        Update Place
      </Button>
    </form>
  );
};

export default UpdatePlace;
