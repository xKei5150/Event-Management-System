import {
    Image,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Select,
    Box,
    NumberInput,
    NumberInputField,
    Spinner,
    Center,
    useToast
} from "@chakra-ui/react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {Controller, useForm} from "react-hook-form";

const API_URL = "http://localhost:8000/v1/contestants/";
const ORGANIZATIONS = ["Golden Hills", "Blue Ridge", "Red Fishers", "Bowling Green"];
const LEVEL = ["Elementary", "Jr. High School", "Sr. High School", "College"];

const AddContestantModal = ({ isOpen, onClose, onSubmit, contestant, setContestant, isEditing, eventId }) => {
    const [imagePreview, setImagePreview] = useState(null);
    const [image, setImage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();



    const { register, control, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm();
    useEffect(() => {
        reset({
            name: contestant?.name || '',
            organization: contestant?.organization || '',
            level: contestant?.level || null,
            contestant_number: contestant?.contestant_number || '',
        });
    }, [contestant, reset]);


    // Watch the file input to preview the image
    const imageFile = watch("imageFile");

    useEffect(() => {
        if (imageFile && imageFile.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(imageFile[0]);
            setImage(imageFile[0]);
        }
    }, [imageFile]);

    useEffect(() => {
        if (isEditing && contestant?.image_path) {
            setImagePreview(`http://localhost:8000/v1/images/${contestant.image_path}`);
        } else {
            setImagePreview(null);
        }
    }, [isEditing, contestant]);


    const handleFormSubmit = async (data) => {
        console.log("test");
        setIsLoading(true);
        const formData = new FormData();
        formData.append('contestant_number', data.contestant_number);
        formData.append('name', data.name);
        formData.append('organization', data.organization);
        formData.append('event_id', eventId);
        formData.append('level', data.level);

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
            // Show success toast
            toast({
                title: 'Success.',
                description: "Contestant submitted/updated successfully!",
                status: 'success',
                duration: 2500,
                isClosable: true,
            });

        } catch (err) {
            console.error('Error submitting the form:', err);

            // Show error toast
            toast({
                title: 'Error.',
                description: err.response?.data?.detail || err.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            // Always turn off the loading indicator
            setIsLoading(false);
            setImage(null); // Reset the image state if needed
        }
    };

    if(isLoading) {
        return (
            <>
                <Center>
                    <Spinner/>;
                </Center>
            </>
        )
    }




    return (

        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <form onSubmit={handleSubmit(handleFormSubmit)}>
                <ModalHeader>{isEditing ? "Edit Contestant" : "Add Contestant"}</ModalHeader>
                <ModalBody>
                    <Box mb={4}>
                        {imagePreview && <Image src={imagePreview} alt="Selected contestant" boxSize="100px" />}
                        <Input type="file" {...register("imageFile")} />
                    </Box>
                    <Input
                        placeholder="Name"
                        {...register("name")}
                        mb={4}
                        isRequired
                    />
                    <Select
                        {...register("organization")}
                        mb={4}
                        placeholder="Select Organization"
                    >
                        {ORGANIZATIONS.map(org => <option key={org} value={org}>{org}</option>)}
                    </Select>
                    <Select
                        {...register("level")}
                        mb={4}
                        placeholder="Select Level"
                        isRequired
                    >
                        {LEVEL.map((lvl, index) => (
                            <option key={lvl} value={index}>
                                {lvl}
                            </option>
                        ))}
                    </Select>

                    <Controller
                        name="contestant_number"
                        control={control}
                        rules={{ required: 'Contestant number is required' }}
                        render={({ field: { onChange, onBlur, value, ref } }) => (
                            <NumberInput
                                onChange={(valueAsString, valueAsNumber) => onChange(valueAsNumber)}
                                onBlur={onBlur}
                                value={value}
                                mb={4}
                                placeholder="Contestant Number"
                                isRequired
                            >
                                <NumberInputField ref={ref} />
                            </NumberInput>
                        )}
                    />
                </ModalBody>
                <ModalFooter>
                    <Button type="submit" isLoading={isLoading}>
                        {isEditing ? "Update" : "Save"}
                    </Button>
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        Cancel
                    </Button>
                </ModalFooter>
                </form>
            </ModalContent>
        </Modal>

    );
};

export default AddContestantModal;
