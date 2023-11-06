import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select, Input, Modal, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, ModalContent,
} from '@chakra-ui/react';
import {addCategory, fetchCategoriesAPI, fetchCategoryDetails} from './categoryAPI';
import CriteriaModal from "./CriteriaModal";
import CategoryTable from "./CategoryTable";

const CategoryPage = () => {
    const [categories, setCategories] = useState([]);
    const [isCriteriaModalOpen, setCriteriaModalOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [allCategories, setAllCategories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [categoryMode, setCategoryMode] = useState(0);


    useEffect(() => {
        async function fetchCategories() {
            try {
                const fetchedCategories = await fetchCategoriesAPI();
                setCategories(fetchedCategories);
                const fetchedCategoryDetails = await fetchCategoryDetails();
                setAllCategories(fetchedCategoryDetails);
                console.log(fetchedCategoryDetails);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    const handleManageCriteria = (categoryId) => {
        setSelectedCategoryId(categoryId);
        setCriteriaModalOpen(true);
    };

    const handleAddCategory = async () => {
        try {
            const eventId = 1;

            const newCategory = await addCategory(newCategoryName, categoryMode, eventId);

            setIsAddModalOpen(false);
            setNewCategoryName('');
            setCategoryMode(0); // Reset back to default mode

            // Fetch updated categories (optional)
            const fetchedCategories = await fetchCategoriesAPI();
            setCategories(fetchedCategories);

        } catch (error) {
            console.error('Error in handleAddCategory:', error);
        }
    };

    const customCategories = categories.filter(cat => cat.mode === 0);
    const referencedCategories = categories.filter(cat => cat.mode !== 0);

    return (
        <Box>
            <Button onClick={() => setIsAddModalOpen(true)}>Add Category</Button>
            <Table variant="striped" size="md">
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Mode</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>

                {customCategories.length > 0 && (
                    <Tbody>
                        <Tr>
                            <Td colSpan="3" bg="gray.200">Custom Categories</Td>
                        </Tr>
                        {customCategories.map(category => (
                            <Tr key={category.id}>
                                <Td>{category.name}</Td>
                                <Td>Custom</Td>
                                <Td>
                                    <Button onClick={() => handleManageCriteria(category.id)}>Manage Criteria</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                )}

                {referencedCategories.length > 0 && (
                    <Tbody>
                        <Tr>
                            <Td colSpan="3" bg="gray.200">Referenced Categories</Td>
                        </Tr>
                        {referencedCategories.map(category => (
                            <Tr key={category.id}>
                                <Td>{category.name}</Td>
                                <Td>Referenced</Td>
                                <Td>
                                    <Button onClick={() => handleManageCriteria(category.id)}>Manage Criteria</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                )}
            </Table>

            <CriteriaModal
                isOpen={isCriteriaModalOpen}
                onClose={() => setCriteriaModalOpen(false)}
                allCategories={allCategories}
                categoryId={selectedCategoryId}
            />
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add New Category</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Input
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                            placeholder="Category Name"
                        />
                        <Select
                            value={categoryMode}
                            onChange={(e) => setCategoryMode(Number(e.target.value))}
                        >
                            <option value={0}>Custom</option>
                            <option value={1}>Referenced</option>
                        </Select>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleAddCategory}>Add</Button>
                        <Button onClick={() => setIsAddModalOpen(false)} ml={3}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>

    );

};
export default CategoryPage;
