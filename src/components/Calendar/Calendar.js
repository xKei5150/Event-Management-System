import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import {useNavigate} from "react-router-dom";
import {
    Button,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter, ModalHeader,
    ModalOverlay,
    Text,
    useDisclosure
} from "@chakra-ui/react";

const Calendar = () => {
    const [calendarEvents, setCalendarEvents] = useState([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const [eventsResponse, announcementsResponse] = await Promise.all([
                    axios.get('http://localhost:8000/v1/events-with-dates/'),
                    axios.get('http://localhost:8000/v1/announcements-with-dates/')
                ]);

                // Map events and announcements to FullCalendar's expected format
                // and assign colors to them
                const events = eventsResponse.data.map(event => ({
                    ...event,
                    title: event.title,
                    start: event.start,
                    end: event.end,
                    color: '#0071c5' // Color for events
                }));

                const announcements = announcementsResponse.data.map(announcement => ({
                    ...announcement,
                    title: announcement.title,
                    start: announcement.start,
                    end: announcement.end,
                    color: '#800000' // Color for announcements
                }));

                // Merge the events and announcements into a single array
                setCalendarEvents([...events, ...announcements]);
            } catch (error) {
                console.error('Error fetching calendar data:', error);
                // Handle error, possibly update the state with an error message
            }
        };

        fetchEvents();
    }, []);

    const renderEventContent = (eventInfo) => {
        return (
            <>
                <div title={eventInfo.event.title}>{eventInfo.event.title}</div>
            </>
        );
    };


    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                themeSystem="material"
                events={calendarEvents}
                eventContent={renderEventContent} // Custom render function
            />
            {selectedEvent && (
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{selectedEvent.title}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            <Text>{selectedEvent.description}</Text>
                        </ModalBody>
                        <ModalFooter>
                            <Button colorScheme="blue" mr={3} onClick={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
            )}
        </>

    );
};

// Custom render function to style events
function renderEventContent(eventInfo) {
    return (
        <>
            <div style={{ backgroundColor: eventInfo.backgroundColor }}>
                <b>{eventInfo.timeText}</b>
                <i>{eventInfo.event.title}</i>
            </div>
        </>
    );
}

export default Calendar;