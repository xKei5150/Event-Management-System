import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { HiExternalLink } from "react-icons/hi";
import axios from 'axios';

import JudgesSection from './JudgingEvent/JudgesSection';
import ContestantsSection from './JudgingEvent/ContestantsSection';

// Add Score-based Event components if you have them
// import ScoreJudgesSection from './ScoreEvent/ScoreJudgesSection';

const EventPage = () => {
    const [event, setEvent] = useState(null);
    const { eventName } = useParams(); // Assuming you use route parameters to determine the event

    useEffect(() => {
        const fetchEvent = async () => {

            const formattedEventName = eventName.replace(/-/g, ' ');

            try {
                const response = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                setEvent(response.data);
            } catch (error) {
                console.error("Error fetching event:", error);
            }
        };

        fetchEvent();
    }, [eventName]);

    if (!event) return <div>Loading...</div>;

    return (
        <div>
            <Link to='score' isExternal>
                Scores <HiExternalLink mx='2px' />
            </Link>

            {event.event_type === "Judged Events" && (
                <>

                    <JudgesSection />
                    <ContestantsSection />
                </>
            )}

            {/* Example for Score-based Events - Adjust as needed */}
            {event.event_type === "Score-based Events" && (
                <>
                    {/* Score-based components */}
                    {/* <ScoreJudgesSection /> */}
                    {/* Other components for Score-based events */}
                </>
            )}
        </div>
    );
};

export default EventPage;
