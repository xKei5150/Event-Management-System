import React, { useState, useEffect } from 'react';
import { Box, Center, Grid, Text, Image } from '@chakra-ui/react';
import ParticipantCard from './PageantCard';
import './pageant.css';

const PageantPage = () => {
    document.title = 'EventPage Night';

    const [participants, setParticipants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const initialParticipants = [
        { id: 1, image: 'participants/taylor.jpeg', group: 'Golden Hills', name: 'Taylor Sheeesh', swimwear: 9.5, longGown: 5.5, talent: 6.7, isSubmitted: false },
        { id: 2, image: 'participants/selena.jpg', group: 'Blue Ridge', name: 'Selena Gomez', swimwear: 3.5, longGown: 0.0, talent: 2.7, isSubmitted: false },
        { id: 3, image: 'participants/chrissy.jpg', group: 'Red Fishers', name: 'Christina Costanza', swimwear: 10, longGown: 10, talent: 10, isSubmitted: false },
        { id: 4, image: 'participants/ariana.jpg', group: 'Bowling Green', name: 'Ariana Grande', swimwear: 8, longGown: 7, talent: 10, isSubmitted: false },
    ];

    useEffect(() => {
        setTimeout(() => {
            setParticipants(initialParticipants);
            setIsLoading(false);
        }, 3000);
    }, []);

    const handleParticipantSubmit = (participantId, isSubmitted) => {
        setParticipants((prevState) => {
            return prevState.map((participant) =>
                participant.id === participantId ? { ...participant, isSubmitted } : participant
            );
        });
    };

    return (
        <Box bg="black" color="white" minW="100vw" minH="100vh">
            <Box position="absolute" top={0} left={0} width="50%" height="100%" zIndex={1} animation="rightGlowAnimation 4s linear infinite" />
            <Box position="absolute" top={0} right={0} width="50%" height="100%" zIndex={1} animation="leftGlowAnimation 4s linear infinite" />
            <Box position="relative" zIndex="1" p={4}>
                {isLoading ? (
                    <Center h="90vh">
                        <div className="loading-container">
                            <Image src="pageant-load.png" alt="Loading" boxSize="350" />
                            <div className="loading-overlay"></div>
                        </div>
                    </Center>
                ) : (
                    <>
                        <Center mb={8}>
                            <Text fontSize="4xl" fontWeight="bold" fontFamily="pageant" className="gradient-text">
                                Pageant Night
                            </Text>
                        </Center>

                        <Center>
                            <Grid
                                templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                                gap={8}
                            >
                                {participants.map((participant) => (
                                    <ParticipantCard
                                        key={participant.id}
                                        participant={participant}
                                        onSubmit={handleParticipantSubmit}
                                        isSubmitted={participant.isSubmitted}
                                    />
                                ))}
                            </Grid>
                        </Center>
                        <Center>
                            <Box
                                as="div"
                                bgImage="url(/participants/Miss-EU.png)"
                                bgSize="10em"
                                bgRepeat="no-repeat"
                                w="10em"
                                h="10em"
                                animation="fadeInOut 2s linear infinite"
                            />
                        </Center>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default PageantPage;
