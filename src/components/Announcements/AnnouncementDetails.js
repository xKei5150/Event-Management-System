// AnnouncementDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Heading,
    Text,
    VStack,
    Divider,
    Container,
    Spinner,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription, Button,
} from '@chakra-ui/react';

const AnnouncementDetails = () => {
    const { id } = useParams();
    const [announcement, setAnnouncement] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAnnouncement = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/v1/announcements/id/${id}`);
                setAnnouncement(response.data);
            } catch (err) {
                setError(err.response?.data?.detail || 'An error occurred while fetching the announcement.');
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncement();
    }, [id]);

    const goBack = () => {
        navigate(-1); // This will take you back to the previous page
    };

    if (loading) {
        return (
            <Container centerContent>
                <Spinner size="xl" />
            </Container>
        );
    }

    if (error) {
        return (
            <Alert status="error" variant="subtle" flexDirection="column" justifyContent="center" textAlign="center" height="200px">
                <AlertIcon boxSize="40px" mr={0} />
                <AlertTitle mt={4} mb={1} fontSize="lg">
                    Error
                </AlertTitle>
                <AlertDescription maxWidth="sm">{error}</AlertDescription>
            </Alert>
        );
    }

    if (!announcement) {
        return (
            <Container centerContent>
                <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                    <Text>Announcement not found.</Text>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxW="container.md" centerContent>
            <Button onClick={goBack} my={4}>Back</Button>
            <VStack
                spacing={4}
                align="stretch"
                w="full"
                p={5}
                bg="white"
                boxShadow="md"
                borderRadius="md"
            >
                <Heading as="h1" size="xl">{announcement.announcement}</Heading>
                <Divider />
                <Box dangerouslySetInnerHTML={{ __html: announcement.description }} />
                {/* Add more details here as needed */}
            </VStack>
        </Container>
    );
};

export default AnnouncementDetails;
