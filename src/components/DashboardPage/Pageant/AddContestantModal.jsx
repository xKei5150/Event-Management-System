import {
    Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, Box,
} from "@chakra-ui/react";
import {useState} from "react";

// ... other imports ...

const AddContestantModal = ({ isOpen, onClose, onSubmit, contestant, setContestant, isEditing }) => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);

        // Preview the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        }
        reader.readAsDataURL(e.target.files[0]);
    };

    const handleSubmit = () => {
        onSubmit(contestant, image); // Pass the image as well when submitting
        setImage(null); // Reset the image state
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEditing ? "Edit Contestant" : "Add Contestant"}</ModalHeader>
                <ModalBody>
                    <Box mb={4}>
                        {imagePreview && <Image src={imagePreview} alt="Selected contestant" boxSize="100px" />}
                        <Input
                            type="file"
                            onChange={handleImageChange}
                        />
                    </Box>
                    <Input
                        placeholder="Name"
                        value={contestant.name}
                        onChange={(e) => setContestant({ ...contestant, name: e.target.value })}
                        mb={4}
                    />
                    <Select
                        value={contestant.organization}
                        onChange={(e) => setContestant({ ...contestant, organization: e.target.value })}
                        mb={4}
                        placeholder="Color Organization"
                    >
                        <option value="Golden Hills">Golden Hills</option>
                        <option value="Blue Ridge">Blue Ridge</option>
                        <option value="Red Fishers">Red Fishers</option>
                        <option value="Bowling Green">Bowling Green</option>
                    </Select>
                </ModalBody>
                <ModalFooter>
                    <Button variant="primary" onClick={handleSubmit}>
                        {isEditing ? "Update" : "Save"}
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddContestantModal;
