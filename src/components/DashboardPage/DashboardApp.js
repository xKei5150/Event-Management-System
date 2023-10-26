import React from 'react';
import {Route, Routes} from 'react-router-dom';
import DashboardPage from "./DashboardPage";
import DashboardAnnouncement from "./Announcement/AnnouncementPage";
import ManageAnnouncements from "./Announcement/ManageAnnouncement";
import DashboardNavbar from './Navbar/Navbar';
import DashboardSidebar from './Sidebar/Sidebar';
import DashboardEvents from './Events/Events';
import ManageEvent from './Events/ManageEvent';
import DashboardSettings from './Settings/Settings';
import EvaluationForm from '../Evaluation/EvaluationForm';
import EventPage from './Events/EventPage/EventPage';
import Score from './Events/EventPage/Score/Score';
import CriteriaPage from "./Events/EventPage/JudgingEvent/CriteriaPage/CriteriaPage";
import {Box, Drawer, DrawerContent, useColorModeValue, useDisclosure} from "@chakra-ui/react";

function DashboardApp() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
            <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
                <DashboardSidebar onClose={onClose} display={{ base: 'none', md: 'block' }} />
                <Drawer
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full"
                >
                    <DrawerContent>
                        <DashboardSidebar onClose={onClose} />
                    </DrawerContent>
                </Drawer>
                <DashboardNavbar onOpen={onOpen} />
                <Box ml={{ base: 0, md: 60 }} p="4">
                    <Box
                        mx="auto"
                        p={4}
                        bg="white"
                        boxShadow="md"
                        borderRadius="md"
                        minH = "80vh"
                    >
                        <Routes>
                            <Route path="/" element={<DashboardPage/>} />
                            <Route path="/announcement" element={<DashboardAnnouncement/>} />
                            <Route path="/announcement/manage/" element={<ManageAnnouncements/>} />
                            <Route path="/announcement/manage/:announcementId" element={<ManageAnnouncements/>} />
                            <Route path="/events" element={<DashboardEvents/>} />
                            <Route path="/events/add-event" element={<ManageEvent />}/>
                            <Route path="/events/manage/:eventId" element={<ManageEvent />} />
                            <Route path="/events/:eventName" element={<EventPage />} />
                            <Route path="/events/:eventName/score" element={<Score />} />
                            <Route path="/events/:eventName/score/manage-criteria" element={<CriteriaPage/>}></Route>
                            <Route path="/events/evaluate" element ={<EvaluationForm />}/>
                            <Route path="/settings" element={<DashboardSettings/>} />
                        </Routes>
                    </Box>
                </Box>
            </Box>
    );
}

export default DashboardApp;
