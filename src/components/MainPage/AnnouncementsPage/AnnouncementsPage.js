import React from 'react';
import Announcements from '../../Announcements/Announcements';
import Calendar from '../../Calendar/Calendar';
import AnnouncementDetails from '../../Announcements/AnnouncementDetails';
import { Box, Flex } from '@chakra-ui/react';
import { Route, Routes } from 'react-router-dom';


const AnnouncementsPage = () => {
    const announcements = [
        { title: 'School Calendar for School Year 2023-2024',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
                'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu f' +
                'ugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
                'sunt in culpa qui officia deserunt mollit anim id est laborum.',
            datePosted: '2023-07-20', eventDate: '2023-08-15', location: 'MSEUFCI Campus'},
        { title: 'Enrollment for School Year 2023-2024 has began!',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
                'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu f' +
                'ugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
                'sunt in culpa qui officia deserunt mollit anim id est laborum.',
            datePosted: '2023-07-20', eventDate: '2023-08-15', location: 'MSEUFCI Campus'},
        { title: 'Congratulations to School Year 2022-2023 Graduates!',
            description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, ' +
                'quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu f' +
                'ugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, ' +
                'sunt in culpa qui officia deserunt mollit anim id est laborum.',
            datePosted: '2023-07-20', eventDate: '2023-08-15', location: 'MSEUFCI Campus'},
    ];

    const events = [
        { title: 'Freshman Enrollment', start: '2023-07-03', end: '2023-08-12' },
        { title: '2nd Year Enrollment', start: '2023-07-17', end: '2023-07-22' },
        { title: '3rd Year Enrollment', start: '2023-07-24', end: '2023-08-05' },
        { title: '4th Year Enrollment', start: '2023-08-07', end: '2023-08-12' },
        { title: 'Classes Start!', start: '2023-08-14', end: '2023-08-14' },
    ];

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
                    <Calendar events={events}
                       handleDateClick={handleDateClick}
                       handleEventClick={handleEventClick} />
                    </Box>
                    </>
                } />
                <Route path="announcements/:id" element={<AnnouncementDetails announcements={announcements} />} />
            </Routes>

        </Flex>
    );
};

export default AnnouncementsPage;