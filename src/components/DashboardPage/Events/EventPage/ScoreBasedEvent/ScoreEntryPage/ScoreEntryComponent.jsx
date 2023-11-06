import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import {
    Box,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Input,
    VStack,
    HStack,
    Text, Spinner,
} from '@chakra-ui/react';
import {useParams} from "react-router-dom";

const ScoreEntryComponent = () => {
        const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedMatch, setSelectedMatch] = useState(null);
        const [matches, setMatches] = useState([]);
        const [teams, setTeams] = useState([]);
        const [isLoading, setIsLoading] = useState(false);
        const { register, handleSubmit, setValue } = useForm();
        const { eventName } = useParams();
        const formattedEventName = eventName.replace(/-/g, ' ');

        useEffect(() => {
            const fetchEventData = async () => {
                setIsLoading(true);
                try {
                    const eventResponse = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                    const eventId = eventResponse.data.id;
                    const teamsResponse = await axios.get(`http://localhost:8000/v1/teams/?event_id=${eventId}`);
                    setTeams(teamsResponse.data);

                    const tournamentResponse = await axios.get(`http://localhost:8000/v1/tournaments/${eventId}`);
                    const tournamentId = tournamentResponse.data.id; // Assuming the first tournament is the one we're interested in

                    const matchesResponse = await axios.get(`http://localhost:8000/v1/matches/${tournamentId}`);
                    let matchData = matchesResponse.data;
                    matchData = matchesResponse.data.filter(match => match.team2_id !== null);
                    // Initialize matches with team names and zero scores
                    const matchDataWithTeams = matchData.map(match => {
                        const team1 = teams.find(team => team.id === match.team1_id) || {};
                        const team2 = teams.find(team => team.id === match.team2_id) || {};
                        return {
                            ...match,
                            team1_name: team1.team_name || 'Unknown Team',
                            team2_name: team2.team_name || 'Unknown Team',
                            team1_score: 0, // Initial score set to 0
                            team2_score: 0, // Initial score set to
                        };
                    });

                    setMatches(matchDataWithTeams);

                    // Fetch and assign scores to each match
                    for (let match of matchDataWithTeams) {
                        const scoresResponse = await axios.get(`http://localhost:8000/v1/scores/${match.id}`);
                        for (const score of scoresResponse.data) {
                            if (score.team_id === match.team1_id) {
                                match.team1_score = score.score;
                            } else if (score.team_id === match.team2_id) {
                                match.team2_score = score.score;
                            }
                        }
                    }

                    setMatches(matchDataWithTeams);
                } catch (error) {
                    console.error('Error fetching event data:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchEventData();
        }, [formattedEventName]);


    const onManageScores = (match) => {
        setSelectedMatch(match);
        onOpen();
    };

    const onFinishGame = async (data) => {
        const { team1_score, team2_score } = data;
        const winnerId = team1_score > team2_score ? selectedMatch.team1_id : selectedMatch.team2_id;
        try {
            await axios.post(`http://localhost:8000/v1/matches/${data.id}/finish`, { winnerId });
            // Update the local state to reflect the changes
            setMatches(matches.map(m => m.id === data.id ? { ...m, winnerId } : m));
        } catch (error) {
            console.error('Error finishing the game:', error);
        }
    };

    const onSubmit = async (data) => {
        // Construct the payload expected by your FastAPI endpoint
        const scoresPayload = {
            scores: [
                { team_id: selectedMatch.team1_id, score: parseInt(data.team1_score) },
                { team_id: selectedMatch.team2_id, score: parseInt(data.team2_score) }
            ]
        };

        try {
            // Send a PATCH request to update the match scores
            await axios.patch(`http://localhost:8000/v1/matches/${selectedMatch.id}/scores`, scoresPayload);
            // Update the local state to reflect the changes
            setMatches(matches.map(m => m.id === selectedMatch.id ? {
                ...m,
                team1_score: scoresPayload.scores[0].score,
                team2_score: scoresPayload.scores[1].score
            } : m));
            onClose(); // Close the modal
        } catch (error) {
            console.error('Error updating scores:', error);
        }
    };



    if (isLoading) {
        return (
            <Box textAlign="center" py={5}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <VStack spacing={4}>
            {matches.map((match) => (
                <HStack key={match.id} justifyContent="space-between" p={4} borderWidth="1px">
                    <Text fontWeight={match.winnerId === match.team1_id ? 'bold' : 'normal'}>
                        {match.team1_name}: {match.team1_score}
                    </Text>
                    <Text fontWeight={match.winnerId === match.team2_id ? 'bold' : 'normal'}>
                        {match.team2_name}: {match.team2_score}
                    </Text>
                    <Button size="sm" onClick={() => onManageScores(match)}>
                        Manage Scores
                    </Button>
                    <Button size="sm" onClick={() => onFinishGame(match)} colorScheme="green">
                        Finish Game
                    </Button>
                </HStack>
            ))}

            {/* Score Management Modal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent as="form" onSubmit={handleSubmit(onSubmit)}>
                    <ModalHeader>Manage Scores</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <VStack spacing={4}>
                            <Box>
                                <Text>{selectedMatch?.team1_name}</Text>
                                <Input
                                    type="number"
                                    {...register('team1_score', { valueAsNumber: true })}
                                />
                            </Box>
                            <Box>
                                <Text>{selectedMatch?.team2_name}</Text>
                                <Input
                                    type="number"
                                    {...register('team2_score', { valueAsNumber: true })}
                                />
                            </Box>
                        </VStack>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} type="submit">
                            Save
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </VStack>
    );
};

export default ScoreEntryComponent;
