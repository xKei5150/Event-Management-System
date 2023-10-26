import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Button, Box, Table, Tbody, Td, Th, Thead, Tr, Text
} from '@chakra-ui/react';
import CriteriaModal from './CriteriaModal';
import { useParams } from "react-router-dom";

const CriteriaPage = () => {
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [eventId, setEventId] = useState(null);
    const { eventName } = useParams();
    const formattedEventName = eventName.replace(/-/g, ' ');

    useEffect(() => {
        const fetchEventId = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                setEventId(response.data.id);
            } catch (error) {
                console.error("Error fetching event ID:", error);
            }
        };

        fetchEventId();
    }, [eventName]);

    useEffect(() => {
        if (eventId) {
            fetchCategories(eventId);
        }
    }, [eventId]);

    const fetchCategories = async (event_id) => {
        try {
            console.log(event_id);
            const response = await axios.get(`http://127.0.0.1:8000/v1/categories/?event_id=${event_id}`);
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleEditClick = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleAddCategory = (event_id) => {
        setSelectedCategory(null);  // Ensure this is null when adding a new category
        setIsModalOpen(true);
    };

    return (
        <div>
            <Box p={5}>
                <Button mb={5} onClick={() => handleAddCategory(eventId)}>
                    Add Category
                </Button>

                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Category</Th>
                            <Th>Criteria</Th>
                            <Th>Min. Score</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {categories.map(category => (
                            <React.Fragment key={category.id}>
                                <Tr>
                                    <Td rowSpan={category.criteria.length || 1}>
                                        {category.name}
                                    </Td>
                                    {category.criteria.length > 0 ? (
                                        <>
                                            <Td>{category.criteria[0].label}</Td>
                                            <Td>{category.criteria[0].min_score}</Td>
                                            <Td rowSpan={category.criteria.length || 1}>
                                                <Button onClick={() => handleEditClick(category)}>
                                                    Edit
                                                </Button>
                                            </Td>
                                        </>
                                    ) : (
                                        <>
                                            <Td>No Criteria</Td>
                                            <Td>-</Td>
                                            <Td>
                                                <Button onClick={() => handleEditClick(category)}>
                                                    Edit
                                                </Button>
                                            </Td>
                                        </>
                                    )}
                                </Tr>
                                {category.criteria.slice(1).map(crit => (
                                    <Tr key={crit.id}>
                                        <Td>{crit.label}</Td>
                                        <Td>{crit.min_score}</Td>
                                    </Tr>
                                ))}
                            </React.Fragment>
                        ))}
                    </Tbody>
                </Table>

                <CriteriaModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        fetchCategories(eventId);  // Fetch updated categories list after closing modal
                    }}
                    setCategories={setCategories}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    eventId={eventId}
                />
            </Box>
        </div>
    );
};

export default CriteriaPage;
