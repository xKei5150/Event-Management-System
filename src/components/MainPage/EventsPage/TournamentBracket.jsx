import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, Flex, useMediaQuery } from '@chakra-ui/react';
import EventsSidebar from './EventsSidebar';
import TournamentDetails from './TournamentDetails';
import MatchesList from "./MatchesList";

function TournamentBracket() {
    const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tournament, setTournament] = useState(null);
    const [matches, setMatches] = useState([]);
    const baseURL = process.env.REACT_APP_BACKEND_URL;
    useEffect(() => {
        // Fetch Score-Based Event
        axios.get(`${baseURL}/events/`).then((response) => {
            const scoreBasedEvents = response.data.filter(event => event.event_type === "Score-based Events");
            setEvents(scoreBasedEvents);
        });
    }, []);

    useEffect(() => {
        if (selectedEvent) {
            // Fetch Tournament Details
            axios.get(`${baseURL}/tournament-round/${selectedEvent.id}`).then((response) => {
                setTournament(response.data);
                // Fetch Matches for the Tournament
                axios.get(`${baseURL}/matches/${response.data.id}`).then(matchesResponse => {
                    setMatches(matchesResponse.data);
                });
            });
        }
    }, [selectedEvent]);

    return (
        <Flex>
            <Box
                width={isLargerThan1280 ? "300px" : "80%"}
                bg="#9f191a"
                bgGradient="linear-gradient(327deg, #9f191a 0%, #610606 46%)"

            color="white"
                p={4}
                minH="80vh"
            >
                <EventsSidebar events={events} onSelectEvent={setSelectedEvent} />
            </Box>
            <Box flex="1" p={4}>
                {tournament && (
                    <TournamentDetails tournament={tournament} />
                )}
                {matches.length > 0 && (
                    <MatchesList matches={matches} />
                )}
            </Box>
        </Flex>
    );
}

export default TournamentBracket;
