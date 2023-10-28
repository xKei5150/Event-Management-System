import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Box,
    Flex,
    Image,
    CloseButton,
    Icon,
    useColorModeValue, Collapse, Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import {FiChevronDown, FiChevronRight, FiSettings} from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
import { SiEventbrite } from 'react-icons/si';
import {TfiAnnouncement} from "react-icons/tfi";

const staticLinks = [
    { name: 'Profile', icon: CgProfile, path: '/dashboard/' },
    { name: 'Announcements', icon: TfiAnnouncement, path: '/dashboard/announcement/' },
    { name: 'Events', icon: SiEventbrite, path: '/dashboard/events' },
    { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
];

const DashboardSidebar = ({ onClose, ...rest }) => {
    const [events, setEvents] = useState([]);
    const [collapsedSections, setCollapsedSections] = useState({});

    useEffect(() => {
        let isMounted = true;  // Track whether component is mounted

        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/v1/events/');
                if (isMounted) {
                    setEvents(response.data);
                }
            } catch (error) {
                console.error("Error fetching events:", error);
            }
        };

        fetchEvents();

        return () => { isMounted = false; }  // Clean up: Set isMounted to false when component unmounts

    }, []);
    const toggleSection = (section) => {
        setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Group events by their type
    const groupedEvents = events.reduce((acc, event) => {
        (acc[event.event_type] = acc[event.event_type] || []).push(event);
        return acc;
    }, {});

    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}
        >
            <Flex mt='3' mb='3' justifyContent="center" alignItems="center">
                <Link to="/">
                    <Image src="/logo.png" h={{ base: "7", md: "20" }} />
                </Link>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>

            {/* Static Links */}
            {staticLinks.map((link) => (
                <NavItem key={link.name} icon={link.icon} path={link.path}>
                    {link.name}
                </NavItem>
            ))}
            {Object.keys(groupedEvents).map((eventType) => (
                <Box key={eventType} w="100%" mt={2}>
                    <Button w="100%" justifyContent="space-between" onClick={() => toggleSection(eventType)}>
                        {eventType}
                        <Icon as={collapsedSections[eventType] ? FiChevronDown : FiChevronRight} />
                    </Button>
                    <Collapse in={collapsedSections[eventType]} animateOpacity>
                        {groupedEvents[eventType].map(event => (
                            <NavItem key={event.id} path={`/dashboard/events/${event.event_name.toLowerCase().replace(/ /g, '-')}`}>
                                {event.event_name}
                            </NavItem>
                        ))}
                    </Collapse>
                </Box>
            ))}
        </Box>
    );
};

const NavItem = ({ icon, children, path, ...rest }) => {
    return (
        <Link to={path} style={{ textDecoration: 'none' }}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                _hover={{
                    bg: 'maroon',
                    color: 'white',
                }}
                {...rest}
            >
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

export default DashboardSidebar;
