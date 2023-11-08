import {
    Button, Table, Thead, Tbody, Tr, Th, Td, HStack, Heading, Text,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import AddContestantModal from './AddContestantModal';
import axios from "axios";
import {useParams} from "react-router-dom";

const ContestantsSection = () => {
    const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
    const [contestants, setContestants] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [contestant, setContestant] = useState({
        name: "",
        organization: "",
        level: null,
        contestant_number: null
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [eventId, setEventId] = useState(null);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const cancelRef = useRef();

    const onCloseAlert = () => setIsAlertOpen(false);
    const [deleteContestantId, setDeleteContestantId] = useState(null);

    const openContestantModal = () => setIsContestantModalOpen(true);

    const closeContestantModal = () => {
        setIsContestantModalOpen(false);
            setContestant({ name: "", organization: "", level: null, contestant_number: null });
        setIsEditing(false);
    };

    const deleteContestant = async (contestantId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/v1/contestants/${contestantId}`);
            if (response.data.status === "deleted") {
                // Filter out the deleted contestant
                setContestants(prevContestants => prevContestants.filter(contestant => contestant.id !== contestantId));
            }
        } catch (err) {
            setError(`Error deleting contestant: ${err.message}`);
        }
    };

    const confirmDeleteContestant = (contestantId) => {
        setDeleteContestantId(contestantId);
        setIsAlertOpen(true);
    };


    const onConfirmDelete = async () => {
        if (deleteContestantId !== null) {
            await deleteContestant(deleteContestantId);
        }
        onCloseAlert();
    };


    const openEditModal = (contestantId) => {
        const contestantToEdit = contestants.find(c => c.id === contestantId);
        if (contestantToEdit) {
            setContestant(contestantToEdit);
            setIsEditing(true);
            setEditingIndex(contestants.findIndex(c => c.id === contestantId)); // only if you still need the index for other purposes
            setIsContestantModalOpen(true);
        }
    };

    const handleContestantSubmit = (newContestant) => {
        if (isEditing) {
            // Update the existing contestant in the list
            setContestants((prevContestants) =>
                prevContestants.map((cont) =>
                    cont.id === newContestant.id ? newContestant : cont
                )
            );
            setIsEditing(false);
        } else {
            // Add the new contestant to the list
            setContestants((prevContestants) => [...prevContestants, newContestant]);
        }

        // Close the modal after submitting
        closeContestantModal();
    };




    const { eventName } = useParams();  // Get the event_name from URL
    const formattedEventName = eventName.replace(/-/g, ' ');

    useEffect(() => {
        // Fetch the event to get its event_id
        const fetchEvent = async () => {
            try {
                const eventResponse = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                const eventId = eventResponse.data.id;
                setEventId(eventId);

                // Fetch contestants after eventId is set
                await fetchContestants(eventId);

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        const fetchContestants = async (eventId) => {
            setIsLoading(true);
            try {
                const response = await axios.get(`http://localhost:8000/v1/contestant-by-event/${eventId}`);
                setContestants(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEvent();
    }, [eventName, contestant]);


    return (
        <>
            <AddContestantModal
                isOpen={isContestantModalOpen}
                onClose={closeContestantModal}
                onSubmit={handleContestantSubmit}
                contestant={contestant}
                setContestant={setContestant}
                isEditing={isEditing}
                eventId={eventId}
            />

            <HStack>
                <Heading as="h2" mt={10}>Contestants</Heading>
                <Button variant="outline" colorScheme="red" onClick={openContestantModal} mt={4}>
                    Add Contestant
                </Button>
            </HStack>

            {isLoading ? (
                <Text mt={4}>Loading contestants...</Text>
            ) : (
                <Table variant="simple" mt={4}>
                    <Thead>
                        <Tr>
                            <Th>Contestant No.</Th>
                            <Th>Name</Th>
                            <Th>Organization</Th>
                            <Th>Level</Th>
                            <Th>Action</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {contestants.map((contestant, index) => (
                            <Tr key={contestant.id}>
                                <Td>{contestant.contestant_number}</Td>
                                <Td>{contestant.name}</Td>
                                <Td>{contestant.organization}</Td>
                                <Td>{contestant.level}</Td>
                                <Td>
                                    <Button variant="ghost" onClick={() => openEditModal(contestant.id)}>Edit</Button>
                                    <Button variant="ghost" colorScheme="red" onClick={() => confirmDeleteContestant(contestant.id)}>
                                        Delete
                                    </Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
            {error && <Text color="red.500" mt={4}>{error}</Text>}
            <AlertDialog
                isOpen={isAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCloseAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Contestant
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure you want to delete this contestant? This action cannot be undone.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseAlert}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={onConfirmDelete} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>

    );
};

export default ContestantsSection;
