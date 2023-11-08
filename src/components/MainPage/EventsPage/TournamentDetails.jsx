import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const TournamentDetails = ({ tournament }) => {
    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mb={4} bg="maroon" color="white">
            <Text fontSize="xl" fontWeight="bold">{tournament.event_name}</Text>
            <Text>Elimination Type: {tournament.elimination_type}</Text>
            <Text>Current Round: {tournament.current_round}</Text>
        </Box>
    );
};

export default TournamentDetails;
