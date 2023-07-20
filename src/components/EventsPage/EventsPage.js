import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Box, Flex, Heading, Text } from '@chakra-ui/react';

const EventsPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);

    const [events, setEvents] = useState([
        {
            title: 'Event 1',
            description: 'Description for Event 1',
            datePosted: '2023-07-20',
            eventDate: '2023-08-15',
        },
        {
            title: 'Event 2',
            description: 'Description for Event 2',
            datePosted: '2023-07-21',
            eventDate: '2023-09-10',
        },
        // Add more events as needed
    ]);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const renderEventMarks = ({ date }) => {
        const event = events.find((event) => date.toDateString() === new Date(event.eventDate).toDateString());
        if (event) {
            return (
                <Box textAlign="center">
                    <Text fontSize="xs" color="red.500" fontWeight="bold">
                        {event.title}
                    </Text>
                </Box>
            );
        }
        return null;
    };

    return (
        <Box p={8} borderRadius="md" boxShadow="md" bg="white" maxW="1000px" m="auto">
            <Flex align="start" justify="space-between">
                {/* Left Side - Events */}
                <Box w="65%">
                    <Heading as="h1" size="xl" mb={4}>
                        Announcements
                    </Heading>
                    {events.map((event, index) => (
                        <Box key={index} bg="gray.100" p={4} borderRadius="md" boxShadow="md" mb={4}>
                            <Heading as="h2" size="lg" mb={2}>
                                {event.title}
                            </Heading>
                            <Text fontSize="md" mb={2}>
                                {event.description}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Date Posted: {event.datePosted}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                                Event Date: {event.eventDate}
                            </Text>
                        </Box>
                    ))}
                </Box>

                {/* Right Side - Calendar */}
                <Box w="35%">
                    <Box bg="white" borderRadius="md" p={4}>
                        <Calendar
                            onChange={setSelectedDate}
                            value={selectedDate}
                            tileClassName="custom-tile"
                            tileContent={renderEventMarks}
                        />
                    </Box>
                </Box>
            </Flex>
        </Box>
    );
};

export default EventsPage;
