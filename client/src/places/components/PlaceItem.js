import React, { useState } from "react";

import PlaceList from "./PlaceList";
import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Modal from "../../shared/components/UIElements/Modal";
import Map from "../../shared/components/UIElements/Map";
import "./PlaceItem.css";

const PlaceItem = (props) => {

  // map state
  const [showMap, setShowMap] = useState(false);
  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);
  

  //delete modal state
  const [showConfirmModal,setShowConfirmModal]= useState(false);
  const showDeleteWarningHandler=()=> setShowConfirmModal(true);
  const cancelDeleteWarningHandler=()=>setShowConfirmModal(false);
  const confirmDeleteHandler =()=>{
    setShowConfirmModal(false);
    console.log('Deleting..')
  };

  
  return (
    <React.Fragment>
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-action"
        footer={<Button onClick={closeMapHandler}>Close</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCanel={cancelDeleteWarningHandler}
        header="Are you sure you want to continue ?"
        footerClass="place-item_modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteWarningHandler}>Cancel</Button>
            <Button inverse onClick={confirmDeleteHandler}> Proceed</Button>
          </React.Fragment>
        }
      >
        <p>Do you want to proceed and delete this place. It cannot be undone</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={props.image} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3> {props.address}</h3>
            <p> {props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={openMapHandler}>
              {" "}
              View on Map
            </Button>
            <Button to={`/places/${props.id}`}>Edit</Button>
            <Button danger onClick={showDeleteWarningHandler}>Delete</Button>
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
