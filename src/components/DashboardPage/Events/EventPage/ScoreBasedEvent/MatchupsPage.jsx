// AdminMatchSetup.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Button,
    Container,
    Heading,
    SimpleGrid,
    useToast,
    VStack,
    Text, IconButton,
} from '@chakra-ui/react';
import {MdDelete} from "react-icons/md";

const MatchupsPage = ({ eventId }) => {
    const [teams, setTeams] = useState([]);
    const [selectedTeams, setSelectedTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [currentRound, setCurrentRound] = useState(1); // Start at round 1
    const toast = useToast();
    const [tournamentId, setTournamentId] = useState(0);

    useEffect(() => {
        // Fetch the teams and matches for the tournament
        const fetchTournamentData = async () => {
            try {
                const teamsResponse = await axios.get(`http://localhost:8000/v1/team-detail/?event_id=${eventId}`);
                const fetchedTeams = teamsResponse.data;
                setTeams(fetchedTeams);

                const tournamentResponse = await axios.get(`http://localhost:8000/v1/tournaments/${eventId}`);
                setTournamentId(tournamentResponse.data.id);

                const matchesResponse = await axios.get(`http://localhost:8000/v1/matches/${tournamentResponse.data.id}`);
                const fetchedMatches = matchesResponse.data;
                if (!Array.isArray(fetchedMatches)) {
                    console.error('Expected fetchedMatches to be an array', fetchedMatches);
                    fetchedMatches = []; // Fallback to an empty array if it's not an array
                }

                const matchesWithNames = fetchedMatches.map(match => ({
                    ...match,
                    team1_name: fetchedTeams.find(team => team.id === match.team1_id)?.team_name || 'Unknown Team',
                    team2_name: fetchedTeams.find(team => team.id === match.team2_id)?.team_name || 'Unknown Team',
                }));

                setMatches(matchesWithNames);

                setCurrentRound(calculateCurrentRound(matchesWithNames));
            } catch (error) {
                toast({
                    title: 'Error fetching data',
                    description: error.message,
                    status: 'error',
                    duration: 9000,
                    isClosable: true,
                });
            }
        };

        fetchTournamentData();
    }, [eventId, toast]);

    const startTournament = async () => {
        try {
            await axios.post(`http://localhost:8000/v1/tournaments/${tournamentId}/start`);
            toast({
                title: 'Tournament Started',
                description: 'The tournament is now active!',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
            // You might want to update local state to reflect the new status
            // setTournamentStatus('active');
        } catch (error) {
            toast({
                title: 'Error Starting Tournament',
                description: `Failed to start the tournament: ${error.message}`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };



    const handleDeleteMatch = async (matchId) => {
        try {
            await axios.delete(`http://localhost:8000/v1/matches/${matchId}`);
            // Filter out the match that was just deleted
            setMatches(matches.filter(match => match.id !== matchId));
            toast({
                title: 'Match deleted',
                description: 'The match has been successfully deleted.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error deleting match',
                description: `Failed to delete the match: ${error.message}`,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };


    const calculateCurrentRound = (matchesWithNames) => {
        // Filter out completed matches
        const completedMatches = matchesWithNames.filter(match => match.status === 'Completed').length;
        // Use the formula to calculate the current round
        return Math.floor(Math.log2(completedMatches + 1)) + 1;
    };

    const isTeamScheduled = (teamId) => {
        // Check if the team is already scheduled for a match in the current round
        return matches.some(match =>
            (match.team1_id === teamId || match.team2_id === teamId) && match.match_round === currentRound
        );
    };

    const createMatch = async () => {
        try {
            let team1_id, team2_id, team1_name, team2_name;

            // If only one team is selected, it means this team should get a bye (automatic advancement)
            if (selectedTeams.length === 1) {
                [team1_id] = selectedTeams;
                team1_name = teams.find(team => team.id === team1_id)?.team_name;
                team2_id = null; // No opposing team, team1 gets a bye
                team2_name = 'Bye'; // Placeholder name for display purposes
            } else if (selectedTeams.length === 2) {
                [team1_id, team2_id] = selectedTeams;
                team1_name = teams.find(team => team.id === team1_id)?.team_name;
                team2_name = teams.find(team => team.id === team2_id)?.team_name;
            } else {
                // If there are no teams or more than two selected, show an error
                toast({
                    title: 'Invalid selection',
                    description: 'Please select one or two teams for the match',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            // Proceed to create the match with the selected team(s)
            const response = await axios.post('http://localhost:8000/v1/matches/', {
                team1_id: team1_id,
                team2_id: team2_id, // This can be null if team1 gets a bye
                tournament_id: tournamentId,
                match_round: currentRound,
                bracket: 'upper',
                status: team2_id ? 'scheduled' : 'completed', // If team2_id is null, mark the match as completed
            });

            // Add the new match to the matches state, including the team names for display
            setMatches([...matches, { ...response.data, team1_name, team2_name }]);
            setSelectedTeams([]); // Reset the selection

            // Show success message
            toast({
                title: 'Match created',
                description: team2_id ? `Match between ${team1_name} and ${team2_name} created.` : `${team1_name} will advance to the next round.`,
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Error creating match',
                description: error.message,
                status: 'error',
                duration: 9000,
                isClosable: true,
            });
        }
    };



    const selectTeam = (teamId) => {
        setSelectedTeams((prevSelected) =>
            prevSelected.includes(teamId)
                ? prevSelected.filter((id) => id !== teamId)
                : [...prevSelected, teamId].slice(0, 2) // Allow only two teams to be selected
        );
    };

    return (
        <Container maxW="container.md" py={5}>
            <VStack spacing={4} align="stretch">
                <Button colorScheme="blue" onClick={startTournament}>
                    Start Tournament
                </Button>
                <Heading mb={4}>Match Ups</Heading>
                <Text>Current Round: {currentRound}</Text>
                <SimpleGrid columns={4} spacing={2}>
                    {teams.map((team) => (
                        <Button
                            key={team.id}
                            colorScheme={selectedTeams.includes(team.id) ? 'green' : 'gray'}
                            onClick={() => selectTeam(team.id)}
                            isDisabled={isTeamScheduled(team.id)}
                        >
                            {team.team_name}
                        </Button>
                    ))}
                </SimpleGrid>
                <Box textAlign="center" my={4}>
                    <Button
                        colorScheme="blue"
                        onClick={createMatch}
                        isDisabled={selectedTeams.length !== 1 && selectedTeams.length !== 2 }
                    >
                        Create Match for Round {currentRound}
                    </Button>
                </Box>
                <Box>
                    <Heading size="md" mb={2}>Upcoming Matches</Heading>
                    {matches.map((match, index) => (
                        <Box key={match.id} p={2} shadow="md" borderWidth="1px">
                            {match.team2_id
                                ? `Match ${index + 1}: ${match.team1_name} vs ${match.team2_name}`
                                : `Match ${index + 1}: ${match.team1_name} gets a bye`}
                            <IconButton
                                aria-label="Delete match"
                                icon={<MdDelete />}
                                onClick={() => handleDeleteMatch(match.id)}
                            />
                        </Box>
                    ))}
                </Box>
            </VStack>
        </Container>
    );
};

export default MatchupsPage;
