import {Box, Flex, Spacer, Image} from '@chakra-ui/react';
import {Link, useLocation} from 'react-router-dom';
import SignInDialog from "../SignInDialog/SignInDialog";

function DashboardNavbar() {
    const hideNavbarPaths = ['/pageant', '/dashboard'];
    const location = useLocation();
    const shouldHideNavbar = () => {
        return hideNavbarPaths.some((path) => location.pathname.startsWith(path));
    };
    if (shouldHideNavbar()) {
        return null;
    }
    return (
        <>
        <Box bg="whiteAlpha.100" py={4} px={8}>
            <Flex alignItems="center">
                <Box>
                    <Link to="/">
                        <Image src="/test-logo.png" h={{ base: "7", md: "20" }} />
                    </Link>
                </Box>
                <Spacer />
                <Box as="nav" className="text-lg font-bold">
                    <Link to="/" className="text-red-900 ml-5 mr-3">Home</Link>
                    <Link to="/about" className="text-red-900 mx-3">About</Link>
                    <Link to="/forms" className="text-red-900 mx-3">Forms</Link>
                    <Link to="/events" className="text-red-900 mx-3">Events</Link>
                </Box>
                <SignInDialog />
            </Flex>
        </Box>
    <Box bg="maroon" height="3px" />
</>
    );
}

export default DashboardNavbar;