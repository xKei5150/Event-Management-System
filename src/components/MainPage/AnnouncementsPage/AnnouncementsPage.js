import React, {useEffect, useState} from 'react';
import Announcements from '../../Announcements/Announcements';
import Calendar from '../../Calendar/Calendar';
import AnnouncementDetails from '../../Announcements/AnnouncementDetails';
import { Box, Flex } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';
import axios from "axios";


const AnnouncementsPage = () => {
    const [announcements, setAnnouncements] = useState([]);
    const [events, setEvents] = useState([]); // If you have events for the Calendar, they should be fetched as well

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('http://localhost:8000/v1/announcements/');
                setAnnouncements(response.data);
                // For Calendar events, you would also set them here if they come from the same or another endpoint
            } catch (error) {
                console.error('Error fetching announcements:', error);
                // Handle error, e.g., show a notification or set error state
            }
        };

        fetchAnnouncements();
    }, []);


    const handleDateClick = (arg) => {
        console.log('Date clicked:', arg.dateStr);
    };

    const handleEventClick = (info) => {
        console.log('Event clicked:', info.event.title);
    }

    return (
        <Flex justifyContent="center" mt="8">
            <Routes>
                <Route exact path="/" element={
                    <>
                    <Box bg="white" p="4" borderRadius="lg" boxShadow="md" w="55%" maxW="55%" mr="4">
                    <Announcements announcements={announcements} />
                    </Box>
                    <Box w="40%">
                    <Calendar />
                    </Box>
                    </>
                } />
                {announcements ? (
                    <Route path="announcements/:id" element={<AnnouncementDetails announcements={announcements} />} />
                ) : (
                    <div>Loading...</div> // Or some loading indicator
                )}

            </Routes>

        </Flex>
    );
};

export default AnnouncementsPage;