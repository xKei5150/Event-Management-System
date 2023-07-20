import {Box, Flex, Spacer, Button, Image} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import SignInDialog from "../SignInDialog/SignInDialog";

function Navbar() {
    return (
        <Box bg="whiteAlpha.100" py={4} px={8}>
            <Flex alignItems="center">
                <Box>
                    <Link to="/">
                        <Image src="/logo.png" className="h-20 w-20"/>
                    </Link>
                </Box>

                <Box as="nav" className="text-lg font-bold">
                    <Link to="/" className="text-red-900 ml-5 mr-3">Home</Link>
                    <Link to="/about" className="text-red-900 mx-3">About</Link>
                    <Link to="/services" className="text-red-900 mx-3">Services</Link>
                    <Link to="/events" className="text-red-900 mx-3">Events</Link>
                </Box>
                <Spacer />
                <SignInDialog />
            </Flex>
        </Box>
    );
}

export default Navbar;