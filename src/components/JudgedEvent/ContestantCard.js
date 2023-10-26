import React, { useEffect, useState } from 'react';
import { Box, Text, FormControl, FormLabel, Input, Flex, Image, Button } from '@chakra-ui/react';
import './judged.css';

const ParticipantCard = ({ participant, onSubmit }) => {
    const [swimwearScore, setSwimwearScore] = useState(participant.swimwear);
    const [longGownScore, setLongGownScore] = useState(participant.longGown);
    const [talentScore, setTalentScore] = useState(participant.talent);
    const [isSubmitButtonLoading, setIsSubmitButtonLoading] = useState(false);
    const [isFormEditable, setIsFormEditable] = useState(!participant.isSubmitted);

    useEffect(() => {
        setIsFormEditable(!participant.isSubmitted);
    }, [participant.isSubmitted]);

    const handleFormSubmit = () => {
        setIsSubmitButtonLoading(true);
        setTimeout(() => {
            setIsSubmitButtonLoading(false);
            setIsFormEditable(false);
            onSubmit(participant.id, true);
        }, 2000);
    };

    const handleEditClick = () => {
        setIsFormEditable(true);
        onSubmit(participant.id, false);
    };

    return (
        <Box p={4} bg="#333333" color="white" borderRadius="lg" maxW="25em" maxH="45em" position="relative">
            {/* Add the overlay only if isSubmitted is true and the form is not editable */}
            {participant.isSubmitted && !isFormEditable && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="rgba(0, 0, 0, 0.8)"
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                >
                    {/* Overlay content */}
                    <Text fontSize="xl" fontWeight="bold" mb={2} color="green.500">
                        Submitted
                    </Text>
                    <Text fontSize="sm" textAlign="center" color="red.500">
                        You have only until all other judges have submitted their scores and/or when the admin proceeds to the next set of participants.
                    </Text>
                    <Button mt={4} colorScheme="red" size="sm" onClick={handleEditClick}>
                        Edit
                    </Button>
                </Box>
            )}

            {/* Rest of the card content */}
            <Flex direction="column" align="center">
                <Image src={participant.image} alt={participant.name} boxSize="200px" mb={2} />
                <Text fontSize="xl" fontFamily="pageant" fontWeight="bold">
                    {participant.name}
                </Text>
                <Text fontSize="md" color="gray.400">
                    {participant.group}
                </Text>
                <FormControl mt={4}>
                    <Flex align="center">
                        <FormLabel flex="2" mr={2}>
                            Swimwear Score
                        </FormLabel>
                        <Input
                            flex="2"
                            type="number"
                            defaultValue={participant.swimwear}
                            value={swimwearScore}
                            onChange={(e) => setSwimwearScore(e.target.value)}
                            disabled={!isFormEditable}
                        />
                    </Flex>
                </FormControl>
                <FormControl mt={4}>
                    <Flex align="center">
                        <FormLabel flex="2" mr={2}>
                            Long Gown Score
                        </FormLabel>
                        <Input
                            flex="2"
                            type="number"
                            defaultValue={participant.longGown}
                            value={longGownScore}
                            onChange={(e) => setLongGownScore(e.target.value)}
                            disabled={!isFormEditable}
                        />
                    </Flex>
                </FormControl>
                <FormControl mt={4}>
                    <Flex align="center">
                        <FormLabel flex="2" mr={2}>
                            Talent Score
                        </FormLabel>
                        <Input
                            flex="2"
                            type="number"
                            defaultValue={participant.talent}
                            value={talentScore}
                            onChange={(e) => setTalentScore(e.target.value)}
                            disabled={!isFormEditable}
                        />
                    </Flex>
                </FormControl>
                <FormControl mt={4} align="center">
                    <Button
                        colorScheme="red"
                        size="md"
                        mt={4}
                        onClick={handleFormSubmit}
                        isLoading={isSubmitButtonLoading}
                        loadingText="Submitting..."
                        spinnerPlacement="start"
                        disabled={participant.isSubmitted || isSubmitButtonLoading}
                    >
                        {isSubmitButtonLoading ? 'Submitting...' : participant.isSubmitted ? 'Submitted' : 'Submit'}
                    </Button>
                </FormControl>
            </Flex>
        </Box>
    );
};

export default ParticipantCard;
