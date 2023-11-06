import {
    Image, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Select, Box, NumberInput, NumberInputField, Spinner,
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:8000/v1/contestants/";
const ORGANIZATIONS = ["Golden Hills", "Blue Ridge", "Red Fishers", "Bowling Green"];
const LEVEL = ["Elementary", "Jr. High School", "Sr. High School", "College"];

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

        const formData = new FormData();
        formData.append('contestant_number', contestant.contestant_number);
        formData.append('name', contestant.name);
        formData.append('organization', contestant.organization);
        formData.append('event_id', eventId); // Assuming `eventId` is defined in the component's state
        formData.append('level', contestant.level); // Add the level to the formData

        // Only add the image if one has been selected
        if (image) {
            formData.append('image', image);
        }

        try {
            // Determine the HTTP method and URL based on whether we are editing or adding a contestant
            const method = isEditing ? 'PUT' : 'POST';
            const url = isEditing ? `${API_URL}${contestant.id}/` : `${API_URL}`;

            // Make the request
            const response = await axios({
                method: method,
                url: url,
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Handle the response
            onSubmit(response.data, image);
        } catch (err) {
            // Handle the error
            console.error('Error submitting the form:', err);
            alert(err.response?.data?.detail || err.message);
        } finally {
            // Always turn off the loading indicator
            setIsLoading(false);
            setImage(null); // Reset the image state if needed
        }
    };

    if(isLoading) {
        return <Spinner />;
    }


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
                    <Select
                        value={contestant.level !== null ? LEVEL[contestant.level] : ''}
                        onChange={(e) => {
                            const levelIndex = LEVEL.indexOf(e.target.value); // This gets the index of the selected level
                            if (levelIndex !== -1) {
                                setContestant({ ...contestant, level: levelIndex }); // Set the index as the level value
                            }
                        }}
                        mb={4}
                        placeholder="Select Level"
                    >
                        {LEVEL.map((lvl, index) => (
                            <option key={lvl} value={lvl}> {/* Use the string label as the value */}
                                {lvl}
                            </option>
                        ))}
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
