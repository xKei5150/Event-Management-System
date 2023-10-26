import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import axios from "axios";

const AddJudgeModal = ({ isOpen, onClose, onSubmit, judgeName, setJudgeName, loginToken, setLoginToken, generateToken, eventId }) => {
    const handleAddJudge = () => {
        if (eventId) {
            onSubmit();

            console.log(eventId);
            axios.post('http://127.0.0.1:8000/v1/judges/', {
                name: judgeName,
                token: loginToken,
                event_id: eventId  // pass the eventId
            }).then(response => {
                // Handle success case
                console.log(response.data);
            }).catch(error => {
                // Handle error case
                console.error('Error adding judge:', error);
            });
        } else {
            console.warn('Event ID not provided. Judge cannot be added.');
            console.log(eventId);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Add Judge</ModalHeader>
                <ModalBody>
                    <Input
                        placeholder="Judge Name"
                        value={judgeName}
                        onChange={(e) => setJudgeName(e.target.value)}
                        mb={4}
                    />
                    <Input
                        placeholder="Login Token"
                        value={loginToken}
                        isReadOnly
                        mb={4}
                    />
                    <Button onClick={generateToken}>Generate Token</Button>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleAddJudge}>
                    Add
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddJudgeModal;
