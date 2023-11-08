import React, {useState, useEffect, useRef} from 'react';
import {
    Box, Center, Grid, Text, Image, Flex, VStack,
    FormControl, FormLabel, InputGroup, HStack, Input, Button, Heading, Td, Table, Thead, Tr, Th, Tbody
} from '@chakra-ui/react';
import './judged.css';
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useSpring, animated } from 'react-spring';
import { useForm, Controller } from 'react-hook-form';

import {calculatePoints, calculateResults} from "./calculatePoints";
import {BeatLoader} from "react-spinners";
import ScoresModal from "./ScoresModal";
import AppreciationBox from "./AppreciationBox";

const JudgedEventPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [contestants, setContestants] = useState([]);
    const [eventTitle, setEventTitle] = useState('');
    const [eventId, setEventId] = useState('');
    const [judgeName, setJudgeName] = useState('');
    const [categories, setCategories] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [hasSubmitted, setHasSubmitted] = useState(false);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(0);
    const [scoreIds, setScoreIds] = useState([]);
    const [scoringStatus, setScoringStatus] = useState([]);
    const [showAppreciation, setShowAppreciation] = useState(false);

    const inputRefs = useRef([]);


    const [isModalOpen, setIsModalOpen] = useState(false);

    const { eventName, judgeId } = useParams();


    useEffect(() => {
        const fetchData = async () => {
            setContestants([]);
            setCategories([]);
            setActiveCategoryIndex(0);
            setCurrentLevel(0);
            setScoreIds([]);
            setScoringStatus([]);
            try {
                const eventResponse = await axios.get(`http://127.0.0.1:8000/v1/events/${eventName}`);
                setEventTitle(eventResponse.data.event_name);
                setEventId(eventResponse.data.id);
                const judgeResponse = await axios.get(`http://localhost:8000/v1/judges/id/${judgeId}`);
                setJudgeName(judgeResponse.data.name);
                const contestantsResponse = await axios.get(`http://127.0.0.1:8000/v1/contestant-by-event/${eventResponse.data.id}`);
                setContestants(contestantsResponse.data);
                const scoringStatusResponse = await axios.get(`http://127.0.0.1:8000/v1/scoring-status/${judgeId}/${eventResponse.data.id}`);
                const categoriesResponse = await axios.get(`http://127.0.0.1:8000/v1/categories-with-custom-criteria/?event_id=${eventResponse.data.id}&mode=0`);

                setCategories(categoriesResponse.data);
                setScoringStatus(scoringStatusResponse.data);
                processScoringStatus(scoringStatusResponse.data, categoriesResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setIsLoading(false);
            }
        };

        // Define the function to process scoring status
        const processScoringStatus = (scoringStatus, categories) => {
            // Initial assumption is that all are scored until found otherwise
            let allScored = true;

            for (const status of scoringStatus) {
                if (!status.scored) {
                    allScored = false;
                    // Find the active category index based on the unscored status
                    const activeCategory = categories.find(c => c.id === status.category_id);
                    if (activeCategory) {
                        setActiveCategoryIndex(categories.indexOf(activeCategory));
                        setCurrentLevel(status.level);
                        break; // Break as soon as the first unscored category is found
                    }
                }
            }

            setShowAppreciation(allScored); // Only show appreciation if all categories are scored
        };

        fetchData().catch(console.error);
        setShowAppreciation(false);
    }, [eventName, judgeId]);

    useEffect(() => {
        inputRefs.current.forEach(inputRef => {
            const inputElem = inputRef.current;
            if (inputElem) {
                const handleWheel = (e) => e.preventDefault();
                inputElem.addEventListener('wheel', handleWheel, { passive: false });
                return () => {
                    inputElem.removeEventListener('wheel', handleWheel);
                };
            }
        });
    }, []);




    const { control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: contestants.reduce((acc, contestant) => {
            if (categories[activeCategoryIndex]) {
                categories[activeCategoryIndex].custom_criteria.forEach(criterion => {
                    acc[`score-${contestant.id}-${criterion.id}`] = ''; // initialize with an empty string
                });
            }
            return acc;
        }, {})
    });

    const getNewDefaultValues = (newLevel, newCategoryIndex) => {
        const newDefaultValues = {};
        contestants
            .filter(contestant => contestant.level === newLevel && contestant.category_id === categories[newCategoryIndex]?.id)
            .forEach(contestant => {
                if (categories[newCategoryIndex]) {
                    categories[newCategoryIndex].custom_criteria.forEach(criterion => {
                        newDefaultValues[`score-${contestant.id}-${criterion.id}`] = ''; // initialize with an empty string
                    });
                }
            });
        return newDefaultValues;
    };


    const contestantsForCurrentCategoryAndLevel = contestants.filter(
        (contestant) =>
            contestant.category_id === categories[activeCategoryIndex]?.id &&
            contestant.level === currentLevel
    );


    const handleEditScores = () => {
        setEditMode(true);
        setHasSubmitted(false);
        setIsModalOpen(false); // Close the modal
    };

    const handleNextLevel = () => {
        // Assuming you know the max level or determine it from the contestants
        const maxLevel = Math.max(...contestants.map((c) => c.level));
        if (currentLevel < maxLevel) {

            setCurrentLevel(currentLevel + 1);
            setHasSubmitted(false);
            setEditMode(false);
            setIsModalOpen(false);
            reset(getNewDefaultValues(currentLevel + 1, activeCategoryIndex))
        } else {
            if (activeCategoryIndex < categories.length - 1) {
                setActiveCategoryIndex((prevIndex) => prevIndex + 1);
                setHasSubmitted(false);
                setEditMode(false);
                setCurrentLevel(0);
                setIsModalOpen(false);
                reset(getNewDefaultValues(0, activeCategoryIndex + 1));

            } else {
                // Possibly handle the case where there are no more categories
                console.log("No more categories to judge.");
            }
        }

    };


    const categoryWithPoints = categories.length > 0 && categories[activeCategoryIndex]
        ? calculatePoints(categories[activeCategoryIndex].custom_criteria)
        : [];


    const onFormSubmit = async (formData) => {
        setIsSubmitting(true); // Start loading

        // Prepare base URL for score submission
        const baseUrl = `http://127.0.0.1:8000/v1/scores/`;

        const newScoreIds = { ...scoreIds };
        const scorePromises = Object.entries(formData).map(async ([key, value]) => {
            // Extract the contestantId and criteriaId from the key
            const [, contestantId, criteriaId] = key.split('-');

            // Prepare the score data for the request
            const scoreData = {
                judge_id: judgeId,
                contestant_id: contestantId,
                category_id: categories[activeCategoryIndex].category.id,
                criteria_id: criteriaId,
                score: value,
            };

            const scoreDataKey = `${contestantId}-${criteriaId}`;
            if (editMode) {
                const scoreId = scoreIds[scoreDataKey];  // Retrieve the scoreId from state
                // Perform the PUT request using the scoreId
                return axios.put(`${baseUrl}${scoreId}/`, scoreData);
            } else {
                try {
                    const response = await axios.post(baseUrl, scoreData);
                    const { data } = response;
                    const { id: scoreId } = data;
                    newScoreIds[scoreDataKey] = scoreId;
                } catch (error) {
                    console.error('An error occurred while submitting scores:', error);
                }
            }
        });

        try {
            const responses = await Promise.all(scorePromises);
            console.log('Scores submitted:', responses);
            setScoreIds(newScoreIds);
            setHasSubmitted(true);
            setEditMode(false); // Reset edit mode
            setIsModalOpen(true); // Show the modal with results
        } catch (error) {
            console.error('An error occurred while submitting scores:', error);
        } finally {
            setIsSubmitting(false); // End loading
        }
    };



    return (
        <Box bg="black" color="white" minW="100vw" minH="100vh">
            <Box position="absolute" top={0} left={0} width="50%" height="100%" zIndex={1} animation="rightGlowAnimation 4s linear infinite" />
            <Box position="absolute" top={0} right={0} width="50%" height="100%" zIndex={1} animation="leftGlowAnimation 4s linear infinite" />
            <Box position="relative" zIndex="1" p={4}>
                <Center mb={8}>
                    <VStack>
                        <Text fontSize="4xl" fontWeight="bold" textTransform="uppercase">
                            {eventTitle || 'Loading...'}
                        </Text>
                        {categories.length > 0 && activeCategoryIndex < categories.length && (
                            <Text fontWeight="bold" fontSize="2xl" mb={4}>
                                Category: {categories[activeCategoryIndex]?.category?.name || 'No Category'}
                            </Text>
                        )}
                    </VStack>
                </Center>

                {isLoading ? (
                    <Center><BeatLoader /></Center>
                ) : showAppreciation ? (
                    <AppreciationBox judgeName={judgeName} eventName={eventTitle} />
                ) : (

                <form onSubmit={handleSubmit(onFormSubmit)}>
                    <Center>
                        <Flex flexDirection={{ base: "column", md: "row" }} gap='1em' maxWidth="90%" margin="0 auto" wrap="wrap">
                            {/* Map through contestants to display form inputs */}
                            {contestantsForCurrentCategoryAndLevel.map((contestant) => (
                                <Box key={contestant.id} bg="#333333" color="white" borderRadius="lg" p={4} >
                                    <Flex direction="column" align="center" >
                                        {/* Display contestant information */}
                                        <Image
                                            src={`http://127.0.0.1:8000/v1/images/${contestant.image_path}`}
                                            alt={contestant.name}
                                            boxSize="200px"
                                            mb={2}
                                        />
                                        <Text fontSize="sm" fontWeight="bold">Contestant No. {contestant.contestant_number}</Text>
                                        <Text fontSize="xl" fontWeight="bold">{contestant.name}</Text>
                                        <Text fontSize="md" color="gray.400">{contestant.organization}</Text>
                                        {categories.length > 0 && categoryWithPoints.map(criterion => (
                                            <FormControl key={criterion.id} isRequired isInvalid={errors[`score-${contestant.id}-${criterion.id}`]}>
                                                <Flex alignItems="flex-start" mt={2}>
                                                    <FormLabel htmlFor={`score-${contestant.id}-${criterion.id}`} mb="0">
                                                        {criterion.label}:
                                                    </FormLabel>
                                                    <VStack align="stretch">
                                                        <Controller
                                                            name={`score-${contestant.id}-${criterion.id}`}
                                                            control={control}
                                                            rules={{
                                                                required: 'This field is required',
                                                                min: {
                                                                    value: criterion.minPoints,
                                                                    message: `Score must be at least ${criterion.minPoints}`,
                                                                },
                                                                max: {
                                                                    value: 100,
                                                                    message: `Score must be at a maximum of 100`,
                                                                },
                                                            }}
                                                            render={({ field, fieldState: { error } }) => (
                                                                <>
                                                                    <Input
                                                                        minW="6em"
                                                                        {...field}
                                                                        type="number"
                                                                        id={`score-${contestant.id}-${criterion.id}`}
                                                                        placeholder={`(Min: ${criterion.minPoints})`}
                                                                        ref={(el) => { inputRefs.current.push({ current: el }); }}
                                                                    />
                                                                    {error && (
                                                                        <Text color="red.500" fontSize="sm" pt={1}>
                                                                            {error.message}
                                                                        </Text>
                                                                    )}
                                                                </>
                                                            )}
                                                        />
                                                    </VStack>
                                                </Flex>
                                            </FormControl>
                                        ))}
                                    </Flex>
                                </Box>
                            ))}
                        </Flex>
                    </Center>
                    <Center mt={6}>
                        <VStack>
                        <Button type="submit"
                                isLoading={isSubmitting}
                                colorScheme='blue'
                                spinner={<BeatLoader size={8} color='white' />}
                                size="lg" mt={4}
                                isDisabled={hasSubmitted}>
                            Submit Scores
                        </Button>

                        <Heading>
                            Judge: {judgeName}
                        </Heading>
                            <ScoresModal
                                isOpen={isModalOpen}
                                onClose={() => setIsModalOpen(false)}
                                contestants={contestants}
                                currentLevel={currentLevel}
                                currentCategoryId={categories[activeCategoryIndex]?.category.id}
                                judgeId={judgeId}
                                onEdit={handleEditScores}
                                onNextLevel={handleNextLevel}
                            />
                        </VStack>
                    </Center>
                </form>
                )}
            </Box>
        </Box>

    );
};
export default JudgedEventPage;
