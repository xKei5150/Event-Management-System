import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {Text, Box, Flex, Heading} from '@chakra-ui/react';

const EventsPage = () => {
    const announcements = [
        { title: 'Announcement 1', description: 'Description for Announcement 1', datePosted: '2023-07-20', eventDate: '2023-08-15'},
        { title: 'Announcement 2', description: 'Description for Announcement 2', datePosted: '2023-07-20', eventDate: '2023-08-15'},
        { title: 'Announcement 1', description: 'Description for Announcement 1', datePosted: '2023-07-20', eventDate: '2023-08-15'},
        { title: 'Announcement 2', description: 'Description for Announcement 2', datePosted: '2023-07-20', eventDate: '2023-08-15'},
        { title: 'Announcement 1', description: 'Description for Announcement 1', datePosted: '2023-07-20', eventDate: '2023-08-15'},
    ];

    const events = [
        { title: 'Event 1', start: '2023-07-20', end: '2023-07-22' },
        { title: 'Event 2', start: '2023-07-25', end: '2023-07-26' },
    ];

    const handleDateClick = (arg) => {
        console.log('Date clicked:', arg.dateStr);
    };

    const handleEventClick = (info) => {
        console.log('Event clicked:', info.event.title);
    };

    return (
        <Flex justifyContent="center">
            <Box bg="white" p="4" borderRadius="lg" boxShadow="md" w="55%" maxW="55%" mr="4">
                <Heading as="h2" size="lg" mb="4">
                    Announcements
                </Heading>
                {announcements.map((announcement, index) => (
                    <Box key={index} bg="gray.100" p={4} borderRadius="md" boxShadow="md" mb={4}>
                        <Heading as="h2" size="lg" mb={2}>
                            {announcement.title}
                        </Heading>
                        <Text fontSize="md" mb={2}>
                            {announcement.description}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Date Posted: {announcement.datePosted}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                            Event Date: {announcement.eventDate}
                        </Text>
                    </Box>
                ))}
            </Box>
            <Box w="40%">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    eventClick={handleEventClick}
                    dateClick={handleDateClick}
                />
            </Box>
        </Flex>
    );
};

export default EventsPage;