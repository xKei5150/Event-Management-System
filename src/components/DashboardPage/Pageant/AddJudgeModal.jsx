import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";

const AddJudgeModal = ({ isOpen, onClose, onSubmit, judgeName, setJudgeName, loginToken, setLoginToken, generateToken }) => {
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
                    <Button variant="primary" onClick={onSubmit}>
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
