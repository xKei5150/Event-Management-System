import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Button,
    useDisclosure,
    useToast,
    Modal,
    ModalHeader,
    ModalContent,
    ModalCloseButton,
    FormControl,
    ModalBody,
    FormLabel,
    Input,
    ModalFooter,
    ModalOverlay,
    Spinner, HStack, VStack
} from '@chakra-ui/react';
import ManageTeamsModal from './ManageTeamsModal';
import axios from "axios";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";

const TournamentSection = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    const [teams, setTeams] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [tournamentDetails, setTournamentDetails] = useState({
        tournamentName: '',
        eliminationType: '',
    });

    const [isManageTeamModalOpen, setIsManageTeamModalOpen] = useState(false);
    const [teamToEdit, setTeamToEdit] = useState(null);


    const [eventId, setEventId] = useState(null);
    const { eventName } = useParams();
    const formattedEventName = eventName.replace(/-/g, ' ');
    useEffect(() => {
        let isComponentMounted = true;  // Track the mounting status
        setIsLoading(true);
        const fetchData = async () => {
            if (isComponentMounted) {
                setIsLoading(true); // Start loading
                try {
                    const eventResponse = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                    if (!isComponentMounted) return; // Exit if the component has been unmounted
                    const eventId = eventResponse.data.id;
                    setEventId(eventId);

                    const tournamentResponse = await axios.get(`http://localhost:8000/v1/tournaments/${eventId}`);
                    if (!isComponentMounted) return; // Exit if the component has been unmounted
                    if (tournamentResponse.data) {
                        setTournamentDetails({
                            tournamentName: tournamentResponse.data.tournament_name,
                            eliminationType: tournamentResponse.data.elimination_type,
                        });
                    }

                    const teamsResponse = await axios.get(`http://localhost:8000/v1/teams?event_id=${eventId}`);
                    if (!isComponentMounted) return; // Exit if the component has been unmounted
                    setTeams(teamsResponse.data);
                } catch (error) {
                    console.error("Error fetching data:", error);
                } finally {
                    if (isComponentMounted) {
                        setIsLoading(false); // Stop loading regardless of outcome
                    }
                }
            }
        };

        fetchData();

        // This return function cleans up when the component unmounts or eventName changes.
        return () => {
            isComponentMounted = false;
            setIsLoading(false);
            setTeams([]); // Reset teams
            setTournamentDetails({
                tournamentName: '',
                eliminationType: '',
            }); // Reset tournament details
            // You might not want to clear eventId if it's used for other purposes outside of this effect.
        };
    }, [eventName]);


    const { register, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            tournamentName: tournamentDetails.tournamentName,
            eliminationType: tournamentDetails.eliminationType,
        },
    });

    const handleSaveTournamentSettings = handleSubmit(async (data) => {
        try {
            // Replace '/api/tournament' with your actual API endpoint
            const response = await axios.post('http://localhost:8000/v1/tournaments', {
                tournament_name: data.tournamentName,
                elimination_type: data.eliminationType,
                event_id: eventId
            });
            onClose(); // Close the modal
            toast({
                title: 'Tournament settings updated successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            toast({
                title: 'Failed to update tournament settings',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    });

    const openManageTeamsModal = () => {
        setTeamToEdit(null);  // No specific team to edit
        setIsManageTeamModalOpen(true);
    };

    const openEditTeamModal = (team) => {
        setTeamToEdit(team);  // Set the specific team to edit
        setIsManageTeamModalOpen(true);
    };



    if (isLoading) {
        return (
            <Box textAlign="center" py={5}>
                <Spinner size="xl" />
            </Box>
        );
    }

    return (
        <Box p={5}>
            <HStack>
                <VStack>
                    <Text fontSize="lg" fontWeight="bold">
                        {tournamentDetails.tournamentName || "Tournament Name"}
                    </Text>
                    <Text fontSize="sm" mb={4}>
                        {`${tournamentDetails.eliminationType || "Type"} Elimination`}
                    </Text>
                </VStack>
                <Button onClick={() => {
                    onOpen();
                    // Set the default values for the form fields when opening the modal
                    setValue('tournamentName', tournamentDetails.tournamentName);
                    setValue('eliminationType', tournamentDetails.eliminationType);
                }}>Set Tournament Settings</Button>
            </HStack>


            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>ID</Th>
                        <Th>Team Name</Th>
                        <Th>Actions</Th>
                        <Th>
                            <Button onClick={openManageTeamsModal} colorScheme="blue" my={4}>
                                Manage Teams
                            </Button>
                            {eventId &&
                                <ManageTeamsModal
                                    eventId={eventId}
                                    isOpen={isManageTeamModalOpen}
                                    onClose={() => setIsManageTeamModalOpen(false)}
                                    teamToEdit={teamToEdit}
                                />}
                            </Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {teams.map(team => (
                        <Tr key={team.id}>
                            <Td>{team.id}</Td>
                            <Td>{team.team_name}</Td>
                            <Td>
                                {/* Placeholder buttons, actions need to be implemented */}
                                <Button size="sm" colorScheme="blue" mr={2} onClick={() => openEditTeamModal(team)}>
                                    Edit
                                </Button>
                                <Button size="sm" colorScheme="red">Delete</Button>
                            </Td>
                            <Td></Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>


            <>
                <Modal isOpen={isOpen} onClose={onClose}>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>Set Tournament Name and Type</ModalHeader>
                        <ModalCloseButton />
                        <form onSubmit={handleSaveTournamentSettings}>
                            <ModalBody>
                                <FormControl id="tournament-name" isRequired>
                                    <FormLabel>Tournament Name</FormLabel>
                                    <Input
                                        placeholder="Enter tournament name"
                                        {...register('tournamentName', { required: 'Tournament name is required' })}
                                    />
                                    {errors.tournamentName && <p>{errors.tournamentName.message}</p>}
                                </FormControl>
                                <FormControl id="elimination-type" mt={4} isRequired>
                                    <FormLabel>Elimination Type</FormLabel>
                                    <Input
                                        as="select"
                                        {...register('eliminationType', { required: 'Elimination type is required' })}
                                    >
                                        <option value="Single">Single Elimination</option>
                                        <option value="Double">Double Elimination</option>
                                        {/* Add other elimination types as needed */}
                                    </Input>
                                    {errors.eliminationType && <p>{errors.eliminationType.message}</p>}
                                </FormControl>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" mr={3} type="submit">
                                    Save Settings
                                </Button>
                                <Button variant="ghost" onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </form>
                    </ModalContent>
                </Modal>
            </>
        </Box>
    );
};

export default TournamentSection;