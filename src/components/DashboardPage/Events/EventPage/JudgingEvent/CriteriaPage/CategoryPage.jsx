import React, {useEffect, useRef, useState} from 'react';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    useToast,
    Select,
    Input,
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    ModalContent,
    AlertDialog, AlertDialogOverlay, AlertDialogContent, AlertDialogHeader, AlertDialogBody, AlertDialogFooter,
} from '@chakra-ui/react';


import {useParams} from "react-router-dom";
import axios from "axios";
import {useForm} from "react-hook-form";
import CriteriaModal from "./CriteriaModal";
import BreadcrumbsComponent from "../../BreadcrumbsComponent";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [isCriteriaModalOpen, setCriteriaModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryMode, setCategoryMode] = useState(0);
    const [isEditing, setIsEditing] = useState(false); // State to handle if we are in edit mode
    const { register, handleSubmit, setValue, reset, formState: { isSubmitting, errors } } = useForm();
    const toast = useToast();
    const { eventName } = useParams();
    const [eventId, setEventId] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false)
    const onCloseAlert = () => setIsAlertOpen(false);
    const cancelRef = useRef(); // For the least destructive focus
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const formattedEventName = eventName.replace(/-/g, ' ');

    const BASE_URL = 'http://localhost:8000/v1';

    const fetchEventId = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/events/${formattedEventName}`);
            const eventId = response.data.id;
            setEventId(eventId);
        } catch (error) {
            console.error('Error fetching event ID:', error);
        }
    };

    const fetchCategories = async (eventId) => {
        try {
            const response = await axios.get(`${BASE_URL}/categories/${eventId}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchEventId();
        fetchCategories(eventId);
        fetchCategoriesAndDetails(eventId);
    }, [eventId, eventName]);



    const onSubmit = async (formData) => {
        console.log("Form data:", formData);
        const apiUrl = formData.id ? `${BASE_URL}/edit-category/${formData.id}` : `${BASE_URL}/add-category`;
        const method = formData.id ? 'put' : 'post';

        try {
            await axios[method](apiUrl, {
                name: formData.name,
                mode: formData.mode,
                event_id: eventId,
            });
            toast({
                title: `Category ${formData.id ? "updated" : "added"}`,
                description: `The category has been ${formData.id ? "updated" : "added"} successfully.`,
                status: "success",
                duration: 5000,
                isClosable: true,
            });
            fetchCategories(eventId);
            reset();
            setIsAddModalOpen(false);
            setIsEditing(false);
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to ${formData.id ? "update" : "add"} the category.`,
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    // Function to open the modal in edit mode
    const handleEditCategory = (category) => {
        setIsEditing(true);
        setIsAddModalOpen(true);
        // Set form values
        setValue('id', category.id);
        setValue('name', category.name);
        setValue('mode', category.mode);
    };

    const fetchCategoriesAndDetails = async (eventId) => {
        try {
            // const fetchedCategories = await axios.get(`${BASE_URL}/categories/${eventId}`);
            // setCategories(fetchedCategories.data);
            // Fetch category details might be required if it contains additional needed data
            const fetchedCategoryDetails = await axios.get(`${BASE_URL}/category-details`);
            setAllCategories(fetchedCategoryDetails.data);
            console.log("Fetched: ", fetchedCategoryDetails);
        } catch (error) {
            console.error('Error fetching categories and details:', error);
            toast({
                title: "Error fetching data",
                description: "There was an issue fetching the category data.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleCriteriaUpdate = () => {
        fetchCategoriesAndDetails(eventId);
    };

    const handleDeleteCategory = (category) => {
        setCategoryToDelete(category);
        setIsAlertOpen(true);
    };



    const confirmDeleteCategory = async () => {
        if (categoryToDelete) {
            try {
                await axios.delete(`${BASE_URL}/categories/${categoryToDelete.id}/`);
                toast({
                    title: "Category deleted",
                    description: "The category has been deleted successfully.",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                });
                setIsAlertOpen(false);
                fetchCategories(eventId);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to delete the category.",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
    };


    const handleManageCriteria = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCriteriaModalOpen(true);
    };

    const openAddModal = () => {
        setIsEditing(false);
        setIsAddModalOpen(true);
        reset(); // Ensure form is reset for add mode
    };




    const customCategories = categories.filter(cat => cat.mode === 0);
    const referencedCategories = categories.filter(cat => cat.mode !== 0);

    return (
        <Box>
            <BreadcrumbsComponent />
            <Button onClick={openAddModal} colorScheme='green'>Add Category</Button>


                {customCategories.length > 0 && (
                    <Table variant="striped" size="md" border="1px" borderBottom="2px" borderColor="black">
                        <Thead borderBottom="2px" borderColor="black">
                            <Tr>
                                <Th>Name</Th>
                                <Th>Mode</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                    <Tbody>
                        <Tr>
                            <Td colSpan="3" bg="gray.200">Custom Categories</Td>
                        </Tr>
                        {customCategories.map(category => (
                            <Tr key={category.id}>
                                <Td>{category.name}</Td>
                                <Td>Custom</Td>
                                <Td>
                                    <Button onClick={() => handleManageCriteria(category.id)} variant='primary'>Manage Criteria</Button>
                                    <Button onClick={() => handleEditCategory(category)}>Edit</Button>
                                    <Button onClick={() => handleDeleteCategory(category)}>Delete</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                    </Table>
                )}

                {referencedCategories.length > 0 && (
                    <Table variant="simple" size="md" mt={2}  border="1px" borderBottom="2px" borderColor="black">
                        <Thead borderBottom="2px" >
                            <Tr>
                                <Th>Name</Th>
                                <Th>Mode</Th>
                                <Th>Actions</Th>
                            </Tr>
                        </Thead>
                    <Tbody>
                        <Tr>
                            <Td colSpan="3" bg="gray.200">Referenced Categories</Td>
                        </Tr>
                        {referencedCategories.map(category => (
                            <Tr key={category.id}>
                                <Td>{category.name}</Td>
                                <Td>Referenced</Td>
                                <Td>
                                    <Button onClick={() => handleManageCriteria(category.id)} variant='primary'>Manage Criteria</Button>
                                    <Button onClick={() => handleEditCategory(category)}>Edit</Button>
                                    <Button onClick={()=>handleDeleteCategory(category)}>Delete</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                    </Table>
                )}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCloseAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Category
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseAlert}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDeleteCategory} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <CriteriaModal
                isOpen={isCriteriaModalOpen}
                onClose={() => {
                    setCriteriaModalOpen(false);
                    handleCriteriaUpdate();
                }}
                allCategories={allCategories}
                categoryId={selectedCategoryId}
            />
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <ModalOverlay />
                <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>{isEditing ? 'Edit Category' : 'Add New Category'}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <Input
                            placeholder="Category Name"
                            {...register('name', { required: 'Category name is required' })}
                        />
                        {errors.name && <p>{errors.name.message}</p>}
                        <Select
                            placeholder="Mode"
                            {...register('mode')}
                            isDisabled={isEditing}
                        >
                            <option value={0}>Custom</option>
                            <option value={1}>Referenced</option>
                        </Select>
                        <input type="hidden" {...register('id')} />
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={() => setIsAddModalOpen(false)} ml={3}>Cancel</Button>
                        <Button colorScheme="blue" type="submit" isLoading={isSubmitting}>
                            {isEditing ? 'Update' : 'Add'}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    );

};
export default CategoryPage;
