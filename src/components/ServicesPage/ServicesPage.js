import { useState } from 'react';
import {
    Box,
    Heading,
    Input,
    Text,
    Button,
    VStack,
    HStack,
    Center,
} from '@chakra-ui/react';
import { IconButton } from '@chakra-ui/react'

function CloseIcon() {
    return null;
}

const ServicesPage = () => {
    const [section, setSection] = useState('');
    const [teamName, setTeamName] = useState('');
    const [teamPlayers, setTeamPlayers] = useState([]);
    const [playerName, setPlayerName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleAddPlayer = () => {
        if (playerName.trim() !== '') {
            setTeamPlayers([...teamPlayers, playerName]);
            setPlayerName('');
        }
    };

    const handleRemovePlayer = (index) => {
        const updatedPlayers = [...teamPlayers];
        updatedPlayers.splice(index, 1);
        setTeamPlayers(updatedPlayers);
    };

    const handleSubmit = () => {
        setIsLoading(true);

        setTimeout(() => {

            setIsLoading(false);
            setSection('');
            setTeamName('');
            setTeamPlayers([]);
            setPlayerName('');
        }, 2000);
    };

    return (
        <Center height="100vh">
            <Box p={8} borderRadius="md" boxShadow="md" bg="white" maxW="400px" width="100%">
                <Heading as="h1" size="xl" mb={8}>
                    Basketball
                </Heading>

                <Box>
                    <Heading as="h3" size="md" mb={4}>
                        Team Information
                    </Heading>
                    <Input
                        type="text"
                        placeholder="Section"
                        value={section}
                        onChange={(e) => setSection(e.target.value)}
                        mb={4}
                    />
                    <Input
                        type="text"
                        placeholder="Team Name"
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        mb={4}
                    />

                    <Heading as="h3" size="md" mb={1}>
                        Team Players
                    </Heading>
                    <VStack align="start" spacing={2}>
                        {teamPlayers.map((player, index) => (
                            <Box
                                key={index}
                                bg="gray.100"
                                p={2}
                                borderRadius="md"
                                display="inline-block"
                                boxShadow="md"
                            >
                                <HStack>
                                    <Text>{player}</Text>
                                    <IconButton
                                        icon={<CloseIcon/>}
                                        variant="ghost"
                                        colorScheme="teal"
                                        size="sm"
                                        aria-label="Remove Player"
                                        onClick={() => handleRemovePlayer(index)}
                                    >
                                    </IconButton>
                                </HStack>
                            </Box>
                        ))}
                    </VStack>

                    <HStack mt={4}>
                        <Input
                            type="text"
                            placeholder="Player Name"
                            value={playerName}
                            onChange={(e) => setPlayerName(e.target.value)}
                        />
                        <Button colorScheme="red" size="sm" onClick={handleAddPlayer}>
                            Add Player
                        </Button>
                    </HStack>

                    <Button
                        colorScheme="blue"
                        size="md"
                        mt={4}
                        onClick={handleSubmit}
                        isLoading={isLoading}
                        loadingText="Submitting..."
                        spinnerPlacement="start"
                    >
                        {isLoading ? 'Submitting...' : 'Submit'}
                    </Button>
                </Box>
            </Box>
        </Center>

    );
};

export default ServicesPage;
