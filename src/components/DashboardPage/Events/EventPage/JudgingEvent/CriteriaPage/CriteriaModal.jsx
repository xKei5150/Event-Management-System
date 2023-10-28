import React, {useEffect, useState} from 'react';
import {
    Button, FormControl, FormLabel, Input, NumberInput, NumberInputField,
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, VStack, HStack,
    Tab,
    Tabs,
    TabList,
    TabPanels,
    TabPanel, Select
} from '@chakra-ui/react';
import axios from "axios";

const CriteriaModal = ({ isOpen, onClose, categories, setCategories, selectedCategory, setSelectedCategory, eventId }) => {
    const [activeTab, setActiveTab] = useState(0);  // 0 for Custom Criteria, 1 for Reference Existing Criteriaf
    const [categoryName, setCategoryName] = useState("");  // Name of the category being edited or added
    const [criteria, setCriteria] = useState([]);  // Criteria for the category being edited or added
    const [referencedCategoryId, setReferencedCategoryId] = useState(null);  // ID of the category being referenced (for Reference Existing Criteria)
    const [percentage, setPercentage] = useState(0);  // Percentage for Reference Existing Criteria
    const [allCategories, setAllCategories] = useState([]);

    const handleTabChange = (index) => {
        setActiveTab(index);
    };

    useEffect(() => {
        if (selectedCategory) {
            setCategoryName(selectedCategory.name);
            const mappedCriteria = selectedCategory.criteria.map(crit => ({
                id: crit.id,
                label: crit.label,
                min: crit.min_score || crit.min,
                max: crit.max_score || crit.max
            }));
            setCriteria(mappedCriteria);
        } else {
            setCategoryName('');
            setCriteria([{ label: '', min: 0, max: 0 }]);
        }
    }, [selectedCategory]);

    useEffect(() => {
        // Fetch all categories when the modal is opened
        const fetchAllCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/v1/categories_with_events/');
                setAllCategories(response.data);
            } catch (error) {
                console.error("Failed to fetch all categories:", error);
            }
        };

        if (isOpen) {
            fetchAllCategories();
        }
    }, [isOpen]);

    const handleSaveCategory = async () => {
        if (activeTab === 0) {
            // Handle Custom Criteria (categories table & endpoint)
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
                        criteria: criteria
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
        } else if (activeTab === 1) {
            // Handle Reference Existing Criteria (categories_by_reference table & endpoint)
            try {
                const payload = {
                    name: categoryName,
                    category_id: referencedCategoryId,  // Assuming you have this state set from the dropdown
                    percentage: percentage  // Assuming you have a state named percentage for this
                };

                if (selectedCategory) {
                    // Edit mode
                    const response = await axios.put(`http://127.0.0.1:8000/v1/categories_by_reference/${selectedCategory.id}`, payload);

                    if (response.status !== 200) {
                        console.error('Failed to update the referenced category:', response.data);
                    }
                } else {
                    // Add new referenced category mode
                    const response = await axios.post('http://127.0.0.1:8000/v1/categories_by_reference/', payload);

                    if (response.status !== 200) {
                        console.error('Failed to add the referenced category:', response.data);
                    }
                }
            } catch (error) {
                console.error('Error handling the referenced category:', error);
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
                    <Tabs isLazy onChange={handleTabChange}>
                        <TabList>
                            <Tab>Custom Criteria</Tab>
                            <Tab>Reference Existing Criteria</Tab>
                        </TabList>

                        <TabPanels>
                            {/* Custom Criteria Tab */}
                            <TabPanel>
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
                                            <FormControl flex="1">
                                                <FormLabel>Maximum Score</FormLabel>
                                                <NumberInput value={criterion.max} min={0} max={100}>
                                                    <NumberInputField
                                                        onChange={(e) => {
                                                            const updatedCriteria = [...criteria];
                                                            updatedCriteria[index].max = e.target.value;
                                                            setCriteria(updatedCriteria);
                                                        }}
                                                    />
                                                </NumberInput>
                                            </FormControl>
                                        </HStack>
                                    ))}
                                    <Button variant="link" onClick={() => setCriteria([...criteria, { label: '', min: 0, max: 0}])}>
                                        + Add Criteria
                                    </Button>
                                </VStack>
                            </TabPanel>

                            {/* Reference Existing Criteria Tab */}
                            <TabPanel>
                                <VStack spacing={4}>
                                    <FormControl>
                                        <FormControl>
                                            <FormLabel>Category Name</FormLabel>
                                            <Input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
                                        </FormControl>
                                        <FormLabel>Select Criteria to Reference</FormLabel>
                                        <Select
                                            placeholder="Select existing criteria"
                                            onChange={(e) => setReferencedCategoryId(Number(e.target.value))}
                                        >
                                            {allCategories.map(category =>
                                                <option key={category.id} value={category.id}>{category.name} from {category.event_name}</option>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Percentage</FormLabel>
                                        <Input
                                            type="number"
                                            value={percentage}
                                            onChange={(e) => setPercentage(e.target.value)}
                                        />
                                    </FormControl>
                                </VStack>
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
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