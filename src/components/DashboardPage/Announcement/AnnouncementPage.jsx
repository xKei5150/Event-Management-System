import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Box,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Heading, HStack, Flex, Spacer,
} from '@chakra-ui/react';

function DashboardAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        async function fetchAnnouncements() {
            try {
                const response = await axios.get('http://localhost:8000/v1/announcements/');
                setAnnouncements(response.data);
            } catch (error) {
                console.error("Error fetching announcements:", error);
                // Handle the error appropriately
            }
        }

        fetchAnnouncements();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8000/v1/announcements/id/${id}`);
            // Refresh announcements after deleting
            const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
            setAnnouncements(updatedAnnouncements);
        } catch (error) {
            console.error("Error deleting announcement:", error);
            // Handle the error appropriately
        }
    }

    return (
        <Box p={5}>
            <Flex mb={3}>
                <Heading as="h2" size="lg" mb="4" color="red.900">
                    Announcements List
                </Heading>
                <Spacer />
                <Link to={'manage/'}>
                    <Button variant="primary">
                        Add Announcement
                    </Button>
                </Link>
            </Flex>

            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Announcement</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {announcements.map((announcement) => (
                        <Tr key={announcement.id}>
                            <Td>{announcement.id}</Td>
                            <Td>{announcement.announcement}</Td>
                            <Td>
                                <Link to={`manage/${announcement.id}`}>
                                    <Button size="sm" colorScheme="blue" mr={3}>
                                        Edit
                                    </Button>
                                </Link>
                                <Button size="sm" colorScheme="red" onClick={() => handleDelete(announcement.id)}>
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </Box>
    )
}

export default DashboardAnnouncement;
