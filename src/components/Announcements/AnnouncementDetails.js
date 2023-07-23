import React from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text } from '@chakra-ui/react';

const AnnouncementDetails = ({ announcements }) => {
    const { id } = useParams();
    const announcement = announcements[id];

    if (!announcement) {
        return <div>Announcement not found</div>;
    }

    const { title, description, datePosted, eventDate, location } = announcement;

    return (
        <Box
            maxW="md"
            mx="auto"
            p={4}
            bg="white"
            boxShadow="md"
            borderRadius="md"
        >
            <Heading as="h2" size="lg" mb={4}>
                {title}
            </Heading>
            <Text fontSize="md" mb={4}>
                {description}
            </Text>
            <Text fontSize="sm" color="gray.600">
                Date Posted: {datePosted}
            </Text>
            <Text fontSize="sm" color="gray.600">
                Event Date: {eventDate}
            </Text>
            <Text fontSize="sm" color="gray.600">
                Location: {location}
            </Text>
        </Box>
    );
};

export default AnnouncementDetails;
