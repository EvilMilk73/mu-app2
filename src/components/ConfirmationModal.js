import React, { useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";

export default function ConfirmationModal({
  confirmationMessage,
  actionOnAccept,
  actionOnDecline,
  showModal,
  setShowModal,
}) {
  
  const closeModal =() => setShowModal(false);
  return (
    <Modal isOpen={showModal} size="lg" unmountOnClose>
      {console.log("render")}
      <ModalHeader>Confirm Action</ModalHeader>
      <ModalBody>{confirmationMessage}</ModalBody>
      <ModalFooter>
        <Button onClick={()=> {
            actionOnAccept();
            closeModal();
        }} className="bg-primary">
          Accept
        </Button>
        <Button onClick={()=>{
            actionOnDecline();
            closeModal();
        }} className="bg-danger">
          Decline
        </Button>
      </ModalFooter>
    </Modal>
  );
}
