import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Heading, HStack } from "@chakra-ui/react";
import {Link, useParams} from "react-router-dom";

import CriteriaPage from "../JudgingEvent/CriteriaPage/CriteriaPage";
const Score = () => {
    const [eventType, setEventType] = useState(null);
    const { eventName } = useParams();
    const formattedEventName = eventName.replace(/-/g, ' ');
    useEffect(() => {
        const fetchEventType = async () => {
            try {

                const response = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                setEventType(response.data.event_type);
            } catch (error) {
                console.error("Error fetching event type:", error);
            }
        };

        fetchEventType();
    }, []);

    if (!eventType) return <div>Loading...</div>;

    return (
        <div>
            <HStack>
                <Heading as="h2" mt={10}>
                    Scores
                </Heading>
                {eventType === "Judged Events" && (
                    <Link to="manage-criteria">
                        <Button variant="outline" colorScheme="red" mt={4}>
                            Manage Criteria for {eventName}
                        </Button>
                    </Link>
                )}

                {eventType === "Score-based Events" && (
                    <Button variant="outline" colorScheme="green" mt={4}>
                        Manage Game Scores
                    </Button>
                )}
            </HStack>
        </div>
    );
}

export default Score;
