import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { useForm } from 'react-hook-form';
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";

const AddJudgeModal = ({ isOpen, onClose, judge, eventId, isEditing, saveJudge }) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },  // Destructure 'isSubmitting' from formState
        reset
    } = useForm({
        defaultValues: {
            judgeName: '',
            loginToken: '',
        }
    });

    const toast = useToast();

    // Function to generate a random token
    const generateToken = () => {
        const randomPart = Math.random().toString(36).substring(2, 10);
        return `mseufci${randomPart}`;  // Return the generated token
    };

    const handleClose = () => {
        reset({ judgeName: '', loginToken: '' });
        onClose();
    };

    // Initialize form with judge data when in edit mode
    useEffect(() => {
        if (isEditing && judge) {
            reset({
                judgeName: judge.name,
                loginToken: judge.token,
            });
        }
    }, [isEditing, judge, reset]);

    const handleJudgeSubmit = async (formData) => {
        if (eventId) {
            const url = isEditing ? `http://127.0.0.1:8000/v1/judges/${judge.id}` : 'http://127.0.0.1:8000/v1/judges/';
            const method = isEditing ? 'PUT' : 'POST';

            try {
                const response = await axios({
                    method: method,
                    url: url,
                    data: {
                        name: formData.judgeName,
                        token: formData.loginToken,
                        event_id: eventId
                    }
                });

                toast({
                    title: isEditing ? "Judge updated." : "Judge added.",
                    description: `The judge has been ${isEditing ? 'updated' : 'added'} successfully.`,
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                reset({
                    judgeName: '',
                    loginToken: '',
                });
                saveJudge(response.data, isEditing);
                console.log(response.data);
                handleClose(); // Close the modal
            } catch (error) {
                toast({
                    title: `Error ${isEditing ? 'updating' : 'adding'} judge.`,
                    description: error.response?.data?.detail || error.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }

        } else {
            toast({
                title: "Operation failed.",
                description: "Event ID not provided. Judge cannot be processed.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent as="form" onSubmit={handleSubmit(handleJudgeSubmit)}>
                <ModalHeader>{isEditing ? 'Edit Judge' : 'Add Judge'}</ModalHeader>
                <ModalBody>
                    <Input
                        placeholder="Judge Name"
                        {...register('judgeName', { required: 'Judge name is required' })}
                        mb={4}

                    />
                    {errors.judgeName && <p>{errors.judgeName.message}</p>}
                    <Input
                        placeholder="Login Token"
                        {...register('loginToken', {
                            required: 'Login token is required'
                        })}
                        isReadOnly={true}
                        mb={4}

                    />
                    {errors.loginToken && <p>{errors.loginToken.message}</p>}
                        <Button onClick={() => setValue('loginToken', generateToken())} mb={4} isDisabled={isEditing}>
                            Generate Token
                        </Button>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                        {isEditing ? 'Update' : 'Add'}
                    </Button>
                    <Button onClick={handleClose}>
                        Cancel
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default AddJudgeModal;
