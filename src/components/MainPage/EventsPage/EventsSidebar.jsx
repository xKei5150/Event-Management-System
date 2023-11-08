import React from 'react';
import {
    Box,
    VStack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';

const EventsSidebar = ({ events, onSelectEvent, selectedEventId }) => {
    // This color will change depending on the color mode (light or dark)
    const bg = useColorModeValue('gray.200', 'gray.700');
    const selectedBg = useColorModeValue('maroon.500', 'maroon.300');
    const hoverBg = useColorModeValue('gray.300', 'gray.600');

    return (
        <VStack align="stretch" spacing={0} borderRadius="md" overflow="hidden">
            {events.map((event) => (
                <Box
                    key={event.id}
                    bg={selectedEventId === event.id ? selectedBg : bg}
                    _hover={{ bg: hoverBg }}
                    p={4}
                    cursor="pointer"
                    color={selectedEventId === event.id ? 'white' : 'black'}
                    onClick={() => onSelectEvent(event)}
                >
                    <Text fontWeight="semibold">{event.event_name}</Text>
                </Box>
            ))}
        </VStack>
    );
};

export default EventsSidebar;
