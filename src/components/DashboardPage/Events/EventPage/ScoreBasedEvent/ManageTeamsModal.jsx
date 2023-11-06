// ManageTeamsModal.jsx

import React, {useEffect, useState} from 'react';
import { useForm } from 'react-hook-form';
import {
    Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton,
    ModalBody, ModalFooter, useDisclosure, FormControl, FormLabel,
    Input, HStack, VStack, Tag, TagLabel, TagCloseButton, IconButton, TabPanels, TabPanel, TabList, Tab, Tabs, useToast
} from '@chakra-ui/react';
import {IoMdPersonAdd} from "react-icons/io";
import axios from "axios";



const ManageTeamsModal = ({ eventId, isOpen, onClose, teamToEdit }) => {
    const { onOpen} = useDisclosure();
    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm();
    const [players, setPlayers] = useState([]);
    const toast = useToast();

    const addPlayer = (playerName) => {
        if (playerName) {
            setPlayers((currentPlayers) => [...currentPlayers, playerName]);
            // Reset the input field
            setValue('playerName', '');
        }
    };
    const deletePlayer = (playerToDelete) => {
        setPlayers((currentPlayers) => currentPlayers.filter(player => player !== playerToDelete));
    };

    const onSubmit = async (data) => {
        try {

            if (teamToEdit) {
                const teamData = {
                    team_name: data.teamName,
                    players: players.map(playerName => ({ player_name: playerName })),
                };
                const response = await axios.put(`http://localhost:8000/v1/teams/${teamToEdit.id}`, teamData);
                console.log(response.data);
                toast({
                    title: 'Team modified.',
                    description: 'The team has been successfully updated.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            } else {
                const teamData = {
                    team_name: data.teamName,
                    players: players.map(playerName => ({ player_name: playerName })),
                    event_id: eventId
                };
                const response = await axios.post('http://localhost:8000/v1/teams', teamData);
                console.log(response.data);


                toast({
                    title: 'Team created.',
                    description: 'The team has been successfully created.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }

            onClose();

        } catch (error) {
            // If there's an error during the API call
            toast({
                title: 'Error creating/updating team.',
                description: error.response?.data?.detail || 'There was an error processing your request.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };


    useEffect(() => {
        if (teamToEdit) {
            // Set form values for team name
            setValue('teamName', teamToEdit.team_name);

            // If players are provided within the teamToEdit object, set them
            if (teamToEdit.players) {
                setPlayers(teamToEdit.players.map(player => player.player_name));
            } else {
                // Reset players if no players data is provided in the teamToEdit
                setPlayers([]);
            }
        } else {
            // Reset form for a new team
            reset({
                teamName: '',
                playerName: '',
            });
            setPlayers([]);
        }
    }, [teamToEdit, setValue, reset]);

    const playerName = watch('playerName');

    return (
        <>


            <Modal isOpen={isOpen} onClose={onClose} size="xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Manage Teams</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Tabs isFitted variant="enclosed">
                            <TabList mb="1em">
                                <Tab>Add Team</Tab>
                                {!teamToEdit && <Tab>Manage Registrations</Tab>}
                            </TabList>
                            <TabPanels>
                                <TabPanel>
                                    {/* Form to add a new team */}
                                    <VStack spacing={4}>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <FormControl>
                                            <FormLabel htmlFor="teamName">Team Name</FormLabel>
                                            <Input id="teamName" {...register('teamName', { required: 'Team name is required' })} />
                                            {errors.teamName && <p>{errors.teamName.message}</p>}
                                        </FormControl>
                                        {/* More form controls for adding team details */}
                                        <FormControl>
                                            <FormLabel htmlFor="playerName">Player Name (optional)</FormLabel>
                                            <HStack>
                                                <Input id="playerName" placeholder="Enter player name" {...register('playerName')} />
                                                <IconButton
                                                    aria-label="Add player"
                                                    icon={<IoMdPersonAdd />}
                                                    onClick={() => addPlayer(playerName)}
                                                />
                                            </HStack>
                                        </FormControl>

                                        {/* List of player names */}
                                        {players.map((player, index) => (
                                            <HStack key={index}>
                                                <Tag size="lg" borderRadius="full">
                                                    <TagLabel>{player}</TagLabel>
                                                    <TagCloseButton onClick={() => deletePlayer(player)} />
                                                </Tag>
                                            </HStack>
                                        ))}
                                        <Button mt={4} colorScheme="blue" type="submit">Submit</Button>
                                    </form>
                                    </VStack>
                                </TabPanel>
                                <TabPanel>
                                    <p>Team registration management logic goes here...</p>
                                </TabPanel>
                            </TabPanels>
                        </Tabs>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ManageTeamsModal;
