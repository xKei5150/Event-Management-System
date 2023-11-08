import {
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    HStack,
    Heading,
    useToast,
    AlertDialog,
    AlertDialogBody,
    AlertDialogHeader, AlertDialogFooter,
    AlertDialogOverlay, AlertDialogContent
} from "@chakra-ui/react";
import {useEffect, useRef, useState} from "react";
import AddJudgeModal from "./AddJudgeModal";
import { useParams } from "react-router-dom";
import axios from "axios";

const JudgesSection = () => {
    const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
    const [judges, setJudges] = useState([]);
    const [eventId, setEventId] = useState(null);
    const toast = useToast();


    const [isEditing, setIsEditing] = useState(false);
    const [selectedJudge, setSelectedJudge] = useState(null);

    const { eventName } = useParams();
    const formattedEventName = eventName.replace(/-/g, ' ');
    const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
    const [judgeToDelete, setJudgeToDelete] = useState(null);
    const cancelRef = useRef();

    useEffect(() => {
        const fetchEventAndJudges = async () => {
            try {
                const eventResponse = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                setEventId(eventResponse.data.id);

                const judgesResponse = await axios.get(`http://127.0.0.1:8000/v1/judges/${eventResponse.data.id}`);
                setJudges(judgesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchEventAndJudges();
    }, [eventName]);


    const handleEditJudge = (judge) => {
        setSelectedJudge(judge);  // Set the selected judge
        setIsEditing(true);       // Enter editing mode
        setIsJudgeModalOpen(true);// Open the modal
    };

    const openJudgeModal = () => {
        setSelectedJudge(null);   // Clear any selected judge
        setIsEditing(false);      // Exit editing mode
        setIsJudgeModalOpen(true);// Open the modal
    };

    const saveJudge = (judgeData, isEditing) => {
        if (isEditing) {
            setJudges(judges.map(judge => judge.id === judgeData.id ? judgeData : judge));
        } else {
            setJudges([...judges, judgeData]);
        }
    };

    const closeJudgeModal = () => {
        setIsJudgeModalOpen(false);
        setIsEditing(false);
        setSelectedJudge(null);
    };

    const onOpenDeleteAlert = (judge) => {
        setJudgeToDelete(judge);
        setIsDeleteAlertOpen(true);
    };

    const onCloseDeleteAlert = () => {
        setIsDeleteAlertOpen(false);
    };

    const confirmDeleteJudge  = async () => {
        if (judgeToDelete) {
            try {
                await axios.delete(`http://127.0.0.1:8000/v1/judges/${judgeToDelete.id}`);
                // Remove judge from the state or refetch the list
                setJudges((currentJudges) => currentJudges.filter((judge) => judge.id !== judgeToDelete.id));
                setIsDeleteAlertOpen(false); // Close the confirmation dialog
                // Show success toast or other UI indication
                toast({
                    title: "Judge deleted.",
                    description: "The judge has been deleted successfully.",
                    status: "success",
                    duration: 2500,
                    isClosable: true,
                });
            } catch (error) {
                // Handle the error
                toast({
                    title: "Failed to delete judge.",
                    description: error.response?.data?.detail || error.message,
                    status: "error",
                    duration: 2500,
                    isClosable: true,
                });
            }
        }
    }
    return (
        <>
            <AddJudgeModal
                isOpen={isJudgeModalOpen}
                onClose={closeJudgeModal}
                saveJudge={saveJudge}
                judge={selectedJudge} // Pass the selected judge for editing
                eventId={eventId}
                isEditing={isEditing}
            />


            <HStack>
                <Heading as="h3">Judges</Heading>
                <Button variant="outline" colorScheme="red" onClick={openJudgeModal} mt={4} textAlign={'right'} >
                    Add Judge
                </Button>
            </HStack>

            <Table variant="simple" mt={4}>
                <Thead>
                    <Tr>
                        <Th>Judge Name</Th>
                        <Th>Login Token</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {judges.map((judge, index) => (
                        <Tr key={index}>
                            <Td>{judge.name}</Td>
                            <Td>{judge.token}</Td>
                            <Td>
                                <Button variant="ghost"
                                        onClick={() => handleEditJudge(judge)}
                                >Edit
                                </Button>
                                <Button colorScheme="red" onClick={() => onOpenDeleteAlert(judge)}>
                                    Delete
                                </Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            <AlertDialog
                isOpen={isDeleteAlertOpen}
                leastDestructiveRef={cancelRef}
                onClose={onCloseDeleteAlert}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize="lg" fontWeight="bold">
                            Delete Judge
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelRef} onClick={onCloseDeleteAlert}>
                                Cancel
                            </Button>
                            <Button colorScheme="red" onClick={confirmDeleteJudge} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
};

export default JudgesSection;


