import {
    Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, Box, NumberInput, NumberInputField, Spinner,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/v1/contestants/";
const ORGANIZATIONS = ["Golden Hills", "Blue Ridge", "Red Fishers", "Bowling Green"];

const AddContestantModal = ({ isOpen, onClose, onSubmit, contestant, setContestant, isEditing, eventId }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        if (isEditing && contestant?.image_path) {
            // Fetch image from server using the new endpoint
            setImagePreview(`http://localhost:8000/v1/images/${contestant.image_path}`);
        } else {
            setImagePreview(null);
        }
    }, [isEditing, contestant]);

    const handleImageChange = (e) => {
        const selectedImage = e.target.files[0];

        if (selectedImage) {
            // Preview the selected image
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(selectedImage);

            setImage(selectedImage);
        }
    };


    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const method = isEditing ? "PUT" : "POST";
            const baseurl = isEditing ? `${API_URL}${contestant.id}/` : API_URL;

            // Construct the URL with query parameters
            const url = `${baseurl}?contestant_number=${contestant.contestant_number}&name=${contestant.name}&organization=${contestant.organization}&event_id=${eventId}`;

            const formData = new FormData();
            if (image) {
                formData.append("image", image);
            }

            const response = await axios({
                method,
                url,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            onSubmit(response.data, image);
            setImage(null);
            setIsLoading(false);

        } catch (err) {
            setIsLoading(false);
            alert(err.response?.data?.detail[0]?.msg || err.message);
        }
    };


    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{isEditing ? "Edit Contestant" : "Add Contestant"}</ModalHeader>
                <ModalBody>
                    <Box mb={4}>
                        {imagePreview && <Image src={imagePreview} alt="Selected contestant" boxSize="100px" />}
                        <Input type="file" onChange={handleImageChange} />
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
                        placeholder="Select Organization"
                    >
                        {ORGANIZATIONS.map(org => <option key={org} value={org}>{org}</option>)}
                    </Select>
                    <NumberInput
                        value={contestant.contestant_number}
                        onChange={(value) => setContestant({ ...contestant, contestant_number: value })}
                        mb={4}
                        placeholder="Contestant Number"
                    >
                        <NumberInputField />
                    </NumberInput>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={handleSubmit} isLoading={isLoading}>
                        {isEditing ? "Update" : "Save"}
                    </Button>
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddContestantModal;
