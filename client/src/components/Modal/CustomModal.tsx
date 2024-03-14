import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

interface CustomModalProps {
  showModal: boolean; // Controls whether the modal is shown
  setShowModal: (show: boolean) => void; // Function to update the visibility from the parent component
  title: string; // Modal title
  body: React.ReactNode;
  cancelButtonText: string;
  confirmButtonText: string;
  onConfirm: () => void;
}

const CustomModal: React.FC<CustomModalProps> = ({ showModal, setShowModal, title, body, cancelButtonText, confirmButtonText, onConfirm }) => {
    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
            <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
                {cancelButtonText}
            </Button>
            <Button variant="primary" onClick={onConfirm}>
                {confirmButtonText}
            </Button>
        </Modal.Footer>
        </Modal>
    );
};

export default CustomModal;
