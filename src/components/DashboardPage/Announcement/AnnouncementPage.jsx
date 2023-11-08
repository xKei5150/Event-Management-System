import axios from 'axios';
import {useEffect, useRef, useState} from 'react';
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
    Heading,
    HStack,
    Flex,
    Spacer,
    useToast,
    AlertDialogFooter,
    AlertDialogBody,
    AlertDialogHeader,
    AlertDialog,
    AlertDialogOverlay, AlertDialogContent,
} from '@chakra-ui/react';

function DashboardAnnouncement() {
    const [announcements, setAnnouncements] = useState([]);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [currentAnnouncementId, setCurrentAnnouncementId] = useState(null);
    const cancelRef = useRef(); // Ref for the cancel button of the alert dialog
    const toast = useToast();

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
            toast({
                title: 'Announcement Deleted',
                description: 'The announcement has been deleted successfully.',
                status: 'success',
                duration: 2500,
                isClosable: true,
            });
        } catch (error) {
            console.error("Error deleting announcement:", error);
            toast({
                title: 'Error',
                description: 'An error occurred while deleting the announcement.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    }


    const onDeleteConfirm = () => {
        handleDelete(currentAnnouncementId);
        setIsAlertOpen(false);
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
                                <Button size="sm" colorScheme="red"  onClick={() => {
                                    setCurrentAnnouncementId(announcement.id);
                                    setIsAlertOpen(true);
                                }}>
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsAlertOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Announcement
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this announcement? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={() => setIsAlertOpen(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={onDeleteConfirm} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </Box>
    )
}

export default DashboardAnnouncement;
