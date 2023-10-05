import React from 'react';
import {Route, Routes} from 'react-router-dom';
import DashboardPage from "./DashboardPage";
import DashboardNavbar from './Navbar/Navbar';
import DashboardSidebar from './Sidebar/Sidebar';
import DashboardEvents from './Events/Events';
import ManageEvent from './Events/ManageEvent';
import DashboardSettings from './Settings/Settings';
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
                <Routes>
                    <Route path="/" element={<DashboardPage/>} />
                    <Route path="/events" element={<DashboardEvents/>} />
                    <Route path="/events/manage/:id" element={<ManageEvent />} />
                    <Route path="/settings" element={<DashboardSettings/>} />
                </Routes>
                </Box>
            </Box>
    );
}

export default DashboardApp;
