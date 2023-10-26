import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box,
    Button,
    Stack,
} from '@chakra-ui/react';
import { Link } from "react-router-dom";
import './style.css';

const DashboardEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const response = await axios.get("http://localhost:8000/v1/events");
                setEvents(response.data);
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        }

        fetchEvents();
    }, []);

    return (
        <Box>
            <Stack direction='row' spacing={4} mb={4} justify='flex-end'>
                <Link to={'add-event'}>
                    <Button variant="primary">Add Event</Button>
                </Link>
                <Button variant="primary">Start Foundation Event</Button>
            </Stack>
            <Table variant="simple" borderWidth="3px" className="responsive-table">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Event Type</Th>
                        <Th>Title</Th>
                        <Th>Location</Th>
                        <Th>Date</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {events.map((event) => (
                        <Tr key={event.id}>
                            <Td>{event.id}</Td>
                            <Td>{event.event_type}</Td>
                            <Td>{event.event_name}</Td>
                            <Td>{event.location}</Td>
                            <Td>{event.start_date}</Td>
                            <Td>
                                <Link to={`manage/${event.id}`}>
                                    <Button variant="primary">Manage Event</Button>
                                </Link>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    );
};

export default DashboardEvents;
