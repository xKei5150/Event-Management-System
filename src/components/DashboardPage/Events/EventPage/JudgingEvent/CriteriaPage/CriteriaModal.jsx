import React, {useEffect, useState} from 'react';
import {
    Button, FormControl, FormLabel, Input, NumberInput, NumberInputField,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, VStack, HStack
} from '@chakra-ui/react';
import axios from "axios";

const CriteriaModal = ({ isOpen, onClose, categories, setCategories, selectedCategory, setSelectedCategory, eventId }) => {
    const [categoryName, setCategoryName] = useState('');
    const [criteria, setCriteria] = useState([{ label: '', min: 0 }]);

    useEffect(() => {
        if (selectedCategory) {
            setCategoryName(selectedCategory.name);
            const mappedCriteria = selectedCategory.criteria.map(crit => ({
                id: crit.id, // Keep the criteria ID
                label: crit.label,
                min: crit.min_score || crit.min
            }));
            setCriteria(mappedCriteria);
        } else {
            setCategoryName('');
            setCriteria([{ label: '', min: 0 }]);
        }
    }, [selectedCategory]);

    const handleSaveCategory = async () => {
        if (selectedCategory) {
            // Edit mode
            try {
                const response = await axios.put(`http://127.0.0.1:8000/v1/categories/${selectedCategory.id}`, {
                    name: categoryName,
                    criteria: criteria
                });

                if (response.status === 200) {
                    // Update the categories state to reflect the edited category
                    const updatedCategories = categories.map(cat =>
                        cat.id === selectedCategory.id ? { ...cat, name: categoryName, criteria } : cat
                    );
                    setCategories(updatedCategories);
                } else {
                    console.error('Failed to update the category:', response.data);
                }
            } catch (error) {
                console.error('Error updating the category:', error);
            }
        } else {
            // Add new category mode
            try {
                const response = await axios.post('http://127.0.0.1:8000/v1/categories/', {
                    name: categoryName,
                    event_id: eventId,
                    criteria
                });

                if (response.status === 200) {
                    // Update the categories state to reflect the added category
                    const newCategory = response.data;

                    if (!newCategory.criteria) {
                        newCategory.criteria = [];
                    }

                    setCategories(prevState => [...prevState, newCategory]);
                } else {
                    console.error('Failed to add the category:', response.data);
                }
            } catch (error) {
                console.error('Error adding the category:', error);
            }
        }


        // Close the modal and clear the selected category
        onClose();
        setSelectedCategory(null);
    };




    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>
                    {selectedCategory ? "Edit Category" : "Add Category"}
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack spacing={4}>
                        <FormControl>
                            <FormLabel>Category Name</FormLabel>
                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                        </FormControl>
                        {criteria.map((criterion, index) => (
                            <HStack key={index} width="full" spacing={4}>
                                <FormControl flex="2">
                                    <FormLabel>Criteria Label</FormLabel>
                                    <Input
                                        value={criterion.label}
                                        onChange={(e) => {
                                            const updatedCriteria = [...criteria];
                                            updatedCriteria[index].label = e.target.value;
                                            setCriteria(updatedCriteria);
                                        }}
                                    />
                                </FormControl>
                                <FormControl flex="1">
                                    <FormLabel>Minimum Score</FormLabel>
                                    <NumberInput value={criterion.min} min={0} max={100}>
                                        <NumberInputField
                                            onChange={(e) => {
                                                const updatedCriteria = [...criteria];
                                                updatedCriteria[index].min = e.target.value;
                                                setCriteria(updatedCriteria);
                                            }}
                                        />
                                    </NumberInput>
                                </FormControl>
                            </HStack>
                        ))}
                        <Button variant="link" onClick={() => setCriteria([...criteria, { label: '', min: 0 }])}>
                            + Add Criteria
                        </Button>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" onClick={handleSaveCategory}>
                        Save Category
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default CriteriaModal;
