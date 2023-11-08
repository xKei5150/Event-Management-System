import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Button, Heading, HStack, VStack} from "@chakra-ui/react";
import {Link, useParams} from "react-router-dom";

import CriteriaPage from "../JudgingEvent/CriteriaPage/CategoryPage";
import MatchupsPage from "../ScoreBasedEvent/MatchupsPage";
import ScorePanel from "../JudgingEvent/ScorePanel";
import BreadcrumbsComponent from "../BreadcrumbsComponent";
const Score = () => {
    const [eventType, setEventType] = useState(null);
    const [eventId, setEventId] = useState(null);
    const { eventName } = useParams();
    const formattedEventName = eventName.replace(/-/g, ' ');
    useEffect(() => {
        const fetchEventType = async () => {
            try {

                const response = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                setEventType(response.data.event_type);
                setEventId(response.data.id);
            } catch (error) {
                console.error("Error fetching event type:", error);
            }
        };

        fetchEventType();
    }, []);

    if (!eventType) return <div>Loading...</div>;

    return (
        <div>
            <BreadcrumbsComponent />
            <HStack>
                <Heading as="h2" mt={10}>
                    Scores
                </Heading>
                {eventType === "Judged Events" && (
                    <Link to="manage-criteria">
                        <Button variant="outline" colorScheme="red" mt={4}>
                            Manage Criteria for {formattedEventName}
                        </Button>
                    </Link>
                )}

                {eventType === "Score-based Events" && (
                    <Link to="manage-scores">
                        <Button variant="outline" colorScheme="green" mt={4}>
                            Manage Game Scores
                        </Button>
                    </Link>
                )}
            </HStack>
            {eventType === "Judged Events" && (
                <>
                    <ScorePanel
                        eventId={eventId}/>
                </>
            )}
            {eventType === "Score-based Events" && (
                <>
            <MatchupsPage
                eventId={eventId}/>
                </>
            )}
        </div>
    );
}

export default Score;
