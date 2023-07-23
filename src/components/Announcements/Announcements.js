// Announcements.js
import React from 'react';
import { Link } from 'react-router-dom';
import {Box, Flex, Heading, Spacer, Text} from "@chakra-ui/react";
import {BsFillCalendar2PlusFill, BsFillCalendarCheckFill} from "react-icons/bs";

const Announcements = ({ announcements }) => {
    return (
        <div>
            <Heading as="h2" size="lg" mb="4" color="red.900">
                Announcements
            </Heading>
            {announcements.map((announcement, index) => (
                <Box key={index} bg="gray.100" p={4} borderRadius="md" boxShadow="md" mb={4}>
                    <Heading as="h2" size="lg" mb={2} color="red.900">
                        <Link to={`announcements/${index}`}>
                            {announcement.title}
                        </Link>
                    </Heading>
                    <Text fontSize="md" mb={2}>
                        {announcement.description}
                    </Text>
                    <Flex>
                        <BsFillCalendar2PlusFill />
                        <Text ml={1} fontSize="sm" color="gray.600">
                            Date Posted: {announcement.datePosted}
                        </Text>
                    <Spacer />
                        <BsFillCalendarCheckFill />
                        <Text ml={1} fontSize="sm" color="gray.600">
                            Event Date: {announcement.eventDate}
                        </Text>
                    </Flex>
                </Box>
            ))}
        </div>
    );
};

export default Announcements;
