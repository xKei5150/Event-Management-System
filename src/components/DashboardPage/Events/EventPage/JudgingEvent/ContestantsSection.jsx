import {
    Button, Table, Thead, Tbody, Tr, Th, Td, HStack, Heading, Text,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
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
        contestant_number: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingIndex, setEditingIndex] = useState(null);
    const [eventId, setEventId] = useState(null);

    const openContestantModal = () => setIsContestantModalOpen(true);

    const closeContestantModal = () => {
        setIsContestantModalOpen(false);
            setContestant({ name: "", organization: "", level: 0, contestant_number: 0 });
    };

    const openEditModal = (index) => {
        setContestant(contestants[index]);
        setIsEditing(true);
        setEditingIndex(index);
        setIsContestantModalOpen(true);
    };

    const handleContestantSubmit = (contestantData, image) => {
        if (isEditing) {
            const updatedContestants = [...contestants];
            updatedContestants[editingIndex] = contestantData;
            setContestants(updatedContestants);
            setIsEditing(false);
            setEditingIndex(null);
        } else {
            setContestants([...contestants, contestantData]);
        }
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
    }, [eventName]);


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
                            <Tr key={index}>
                                <Td>{contestant.contestant_number}</Td>
                                <Td>{contestant.name}</Td>
                                <Td>{contestant.organization}</Td>
                                <Td>{contestant.level}</Td>
                                <Td>
                                    <Button variant="ghost" onClick={() => openEditModal(index)}>Edit</Button>
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            )}
            {error && <Text color="red.500" mt={4}>{error}</Text>}
        </>
    );
};

export default ContestantsSection;
