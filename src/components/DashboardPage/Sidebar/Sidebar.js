import React from 'react';
import {
    Box,
    Flex,
    Text,
    Image,
    CloseButton,
    Icon,
    useColorModeValue,
} from '@chakra-ui/react';
import { FiHome, FiTrendingUp, FiSettings } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { Link } from "react-router-dom";

const LinkItems = [
    { name: 'Profile', icon: FiHome, path: '/dashboard/' }, // Default profile page
    { name: 'Events', icon: FiTrendingUp, path: '/dashboard/events' },
    { name: 'Settings', icon: FiSettings, path: '/dashboard/settings' },
];

const DashboardSidebar = ({ onClose, ...rest }) => {
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
            <Flex mt='3' mb='3' display="flex" justifyContent="center" alignItems="center">
                <Link to="/">
                    <Image src="/logo.png" h={{ base: "7", md: "20" }} />
                </Link>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {LinkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} path={link.path}>
                    {link.name}
                </NavItem>
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
                activeClassName="active-link" // Add a custom CSS class for active links
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
