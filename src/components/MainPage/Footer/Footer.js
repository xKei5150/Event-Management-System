import React from 'react';
import { ReactNode } from 'react';
import {
    Box,
    Container,
    SimpleGrid,
    Stack,
    Text,
    Image,
    useColorModeValue,
} from '@chakra-ui/react';
import {useLocation} from "react-router-dom";

const ListHeader = ({ children }) => {
    return (
        <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
            {children}
        </Text>
    );
};
export default function Footer() {
    const bgColor = useColorModeValue('gray.50', 'gray.900');
    const textColor = useColorModeValue('gray.700', 'gray.200');
    const hideFooterPaths = ['/event', '/dashboard'];
    const location = useLocation();
    const shouldHideFooter = () => {
        return hideFooterPaths.some((path) => location.pathname.startsWith(path));
    };
    if (shouldHideFooter()) {
        return null;
    }
    return (
        <Box bg= {bgColor} color={textColor}>
            <Container as={Stack} maxW={'6xl'} py={10}>
                <SimpleGrid
                    templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 1fr 1fr' }}
                    spacing={8}
                >
                    <Stack spacing={6}>
                        <Image src="/logo.png"  boxSize="150px"/>
                        <Text fontSize={'sm'}>© 2023 College of Computer Science</Text>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Navigation</ListHeader>
                        <Box as="a" href={'#'}>
                            Home
                        </Box>
                        <Box as="a" href={'#'}>
                            Announcements
                        </Box>
                        <Box as="a" href={'#'}>
                            About
                        </Box>
                    </Stack>
                    <Stack align={'flex-start'}>
                        <ListHeader>Facebook Links</ListHeader>
                        <Box as="a" href={'#'}>
                            Facebook
                        </Box>
                    </Stack>
                </SimpleGrid>
            </Container>
        </Box>
    );
}
