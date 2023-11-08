import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Stack, Icon, useColorModeValue } from '@chakra-ui/react';
import { BsFillCalendar2PlusFill, BsFillCalendarCheckFill } from "react-icons/bs";
import { format } from 'date-fns'; // Don't forget to import format from date-fns

const FadeText = ({ text }) => {
    const maxHeight = '6.5rem'; // for two lines of text

    return (
        <Box
            position="relative"
            maxHeight={maxHeight}
            overflow="hidden"
            _after={{
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1rem', // height of the fade effect
                backgroundImage: 'linear-gradient(to bottom, transparent, white)', // 'white' should match the background color of your app
            }}
        >
            <Text fontSize="md" dangerouslySetInnerHTML={{ __html: text }} />
        </Box>
    );
};

const Announcements = ({ announcements }) => {
    // Call hooks at the top level of your component
    const bg = useColorModeValue('gray.100', 'gray.700');
    const hoverBg = useColorModeValue('gray.200', 'gray.600');

    return (
        <Stack spacing={4}>
            <Heading as="h2" size="lg" mb="4" color="red.900">
                Announcements
            </Heading>
            {announcements.map((announcement) => (
                <Box
                    as={RouterLink}
                    to={`/announcements/${announcement.id}`}
                    key={announcement.id}
                    bg={bg} // Use variables instead of calling the hook
                    p={4}
                    borderRadius="md"
                    boxShadow="md"
                    mb={4}
                    _hover={{
                        textDecoration: 'none',
                        bg: hoverBg, // Use variables instead of calling the hook
                    }}
                >
                    <Heading as="h3" size="md" mb={2}>
                        {announcement.announcement}
                    </Heading>
                    <Text noOfLines={2} fontSize="md">
                        <FadeText text={announcement.description} />
                    </Text>
                    <Stack mt={3} direction="row" spacing={4} align="center">
                        <Icon as={BsFillCalendar2PlusFill} />
                        {announcement.startDate && (
                            <Text fontSize="sm">
                                Start: {format(new Date(announcement.startDate), 'PP')}
                            </Text>
                        )}
                        {announcement.endDate && (
                            <Icon as={BsFillCalendarCheckFill} />
                        )}
                        {announcement.endDate && (
                            <Text fontSize="sm">
                                End: {format(new Date(announcement.endDate), 'PP')}
                            </Text>
                        )}
                    </Stack>
                </Box>
            ))}
        </Stack>
    );
};

export default Announcements;
