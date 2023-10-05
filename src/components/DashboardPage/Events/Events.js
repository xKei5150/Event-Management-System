import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer, Box, Button,
} from '@chakra-ui/react'
import {Link} from "react-router-dom";
const DashboardEvents = () => {

    const eventsData = [
        { id: 1, name: 'Event 1', date: '2023-10-10', location: 'School Gym' },
        { id: 2, name: 'Event 2', date: '2023-11-15', location: 'Auditorium' },
        // Add more event data as needed
    ];

    return (
        <Box p="4">
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Name</Th>
                        <Th>Date</Th>
                        <Th>Location</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {eventsData.map((event) => (
                        <Tr key={event.id}>
                            <Td>{event.id}</Td>
                            <Td>{event.name}</Td>
                            <Td>{event.date}</Td>
                            <Td>{event.location}</Td>
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
    )
};

export default DashboardEvents;
