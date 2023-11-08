import React, { useState, useEffect } from 'react';
import { Box, VStack, Text, Flex, Badge, Divider } from '@chakra-ui/react';
import axios from "axios";

const MatchItem = ({ match, scores }) => {
    const formatDate = (dateString) => {
        return dateString ? new Date(dateString).toLocaleDateString() : 'TBA';
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'linear-gradient( 109.6deg,  rgba(61,131,97,1) 11.2%, rgba(28,103,88,1) 91.1% )';
            case 'scheduled':
                return 'linear-gradient( 90.2deg,  rgba(79,255,255,1) 0.3%, rgba(0,213,255,1) 99.8% )';
            case 'in_progress':
                return 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(249,232,51,1) 0%, rgba(250,196,59,1) 100.2% )';
            default:
                return 'gray';
        }
    };

    return (
        <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} bg={getStatusColor(match.status)}>
            <Flex justifyContent="space-between" alignItems="center">
                <Flex direction="column">
                    <Text fontWeight={match.winner_id === match.team1_id ? 'bold' : 'normal'}>
                        Team {match.team1_id} {scores[match.team1_id] !== undefined ? `[${scores[match.team1_id]}]` : ''}
                    </Text>
                    <Text fontWeight={match.winner_id === match.team2_id ? 'bold' : 'normal'}>
                        vs Team {match.team2_id ? `${match.team2_id} ${scores[match.team2_id] !== undefined ? `[${scores[match.team2_id]}]` : ''}` : '(Default)'}
                    </Text>
                </Flex>
                <Badge colorScheme={getStatusColor(match.status)}>{match.status.toUpperCase()}</Badge>
                {match.match_date && <Text fontSize="sm">{formatDate(match.match_date)}</Text>}
            </Flex>
        </Box>
    );
};

const MatchesList = ({ matches }) => {
    const [matchScores, setMatchScores] = useState({});
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        const loadScores = async () => {
            const scores = {};
            for (const match of matches) {
                const response = await axios.get(`${baseURL}/matches/${match.id}/score`);
                scores[match.id] = {};
                response.data.forEach(score => {
                    scores[match.id][score.team_id] = score.score;
                });
            }
            setMatchScores(scores);
        };

        if (matches.length) {
            loadScores();
        }
    }, [matches]);

    const upperBracketMatches = matches.filter(match => match.bracket === 'upper');
    const lowerBracketMatches = matches.filter(match => match.bracket === 'lower');

    return (
        <VStack align="stretch" spacing={4}>
            {upperBracketMatches.length > 0 && (
                <>
                    <Text fontWeight="bold" fontSize="lg" p={2}>Upper Bracket</Text>
                    <Divider />
                    {upperBracketMatches.map((match) => (
                        <MatchItem key={match.id} match={match} scores={matchScores[match.id] || {}} />
                    ))}
                </>
            )}
            {lowerBracketMatches.length > 0 && (
                <>
                    <Text fontWeight="bold" fontSize="lg" p={2}>Lower Bracket</Text>
                    <Divider />
                    {lowerBracketMatches.map((match) => (
                        <MatchItem key={match.id} match={match} scores={matchScores[match.id] || {}} />
                    ))}
                </>
            )}
        </VStack>
    );
};

export default MatchesList;
