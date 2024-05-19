import React, {useState} from 'react';
import { Modal, Button } from 'react-bootstrap';

interface UnauthorizedModalProps {
    show: boolean; // Indicates whether the modal should be shown
    onClose: () => void; // Function to handle closing the modal
}

const UnauthorizedModal: React.FC<UnauthorizedModalProps> = () => {
    const [show, setShow] = useState(true)
    //const navigate = useNavigate();
    const onClose=()=>setShow(!show)
    const handleLoginClick = () => {
        onClose(); // Close the modal
    };

    return (

        <Modal  show={show} onHide={onClose} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Your Session has Expired</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>Your session has expired. Please log in again to continue.</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={handleLoginClick}>Go to Login Page</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default UnauthorizedModal;
