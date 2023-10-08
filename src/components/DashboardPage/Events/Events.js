import React from 'react';
import {
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Box, Button, Stack,
} from '@chakra-ui/react'
import {Link} from "react-router-dom";
import './style.css';
const DashboardEvents = () => {

    const eventsData = [
        { id: 1, name: 'Event 1', date: '2023-10-10', location: 'School Gym' },
        { id: 2, name: 'Event 2', date: '2023-11-15', location: 'Auditorium' },
    ];

    return (
        <Box>
            <Stack direction='row' spacing={4} mb={4} justify='flex-end'>
                <Link to={'add-event'}>
                    <Button variant="primary">Add Event</Button>
                </Link>
                <Button variant="primary">Start Foundation Event</Button>
            </Stack>
            <Table variant="simple" borderWidth = "3px" className="responsive-table">
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
