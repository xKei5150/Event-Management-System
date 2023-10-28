import React, { useState, useEffect } from 'react';
import {
    Box, Center, Grid, Text, Image, Flex, VStack,
    FormControl, FormLabel, InputGroup, HStack, Input, Button, Heading
} from '@chakra-ui/react';
import './judged.css';
import axios from 'axios';
import { useParams } from "react-router-dom";

const JudgedEventPage = () => {
    const [contestants, setContestants] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventTitle, setEventTitle] = useState('');
    const [eventId, setEventId] = useState('');
    const [judgeName, setJudgeName] = useState('');
    const [categories, setCategories] = useState([]);
    const [scores, setScores] = useState({});
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);

    const { eventName, judgeId } = useParams();

    const [allJudgesSubmitted, setAllJudgesSubmitted] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const eventResponse = await axios.get(`http://127.0.0.1:8000/v1/events/${eventName}`);
                setEventTitle(eventResponse.data.event_name);
                setEventId(eventResponse.data.id);
                const judgeResponse = await axios.get(`http://localhost:8000/v1/judges/id/${judgeId}`);
                setJudgeName(judgeResponse.data.name);
                const contestantsResponse = await axios.get(`http://127.0.0.1:8000/v1/contestant-by-event/${eventResponse.data.id}`);
                setContestants(contestantsResponse.data);
                const categoriesResponse = await axios.get(`http://127.0.0.1:8000/v1/categories?event_id=${eventResponse.data.id}`);
                setCategories(categoriesResponse.data);
                setIsLoading(false);
            } catch (error) {
                console.error("Failed to fetch data:", error);
                setIsLoading(false);
            }
        };

        fetchData();
    }, [eventName, judgeId]);

    useEffect(() => {
        // This checks if all judges have submitted for the current category
        const checkAllJudgesSubmitted = async () => {
            const response = await axios.get(`http://127.0.0.1:8000/v1/scores/check-category-submission/${categories[activeCategoryIndex].id}`);
            console.log(response.data.allSubmitted);
            setAllJudgesSubmitted(response.data.allSubmitted);
        };

        if (categories.length > 0) {
            checkAllJudgesSubmitted();
        }
    }, [activeCategoryIndex, categories]);

    const handleNextCategory = () => {
        if (activeCategoryIndex < categories.length - 1) {
            setActiveCategoryIndex(prevIndex => prevIndex + 1);
        }
    };

    const handleScoreChange = (contestantId, criteriaId, e) => {
        const updatedScores = { ...scores };
        if (!updatedScores[contestantId]) {
            updatedScores[contestantId] = {};
        }
        updatedScores[contestantId][criteriaId] = e.target.value;
        setScores(updatedScores);
    };

    const handleSubmitScores = async () => {
        for (let contestantId in scores) {
            for (let criteriaId in scores[contestantId]) {
                const scoreData = {
                    judge_id: judgeId,
                    contestant_id: contestantId,
                    category_id: categories[activeCategoryIndex].id,
                    criteria_id: criteriaId,
                    score: scores[contestantId][criteriaId]
                };

                try {
                    await axios.post('http://127.0.0.1:8000/v1/scores/', scoreData);
                } catch (error) {
                    console.error("Failed to submit score for contestant:", contestantId, "error:", error);
                }
            }
        }
        console.log("Scores submitted");
    };

    return (
        <Box bg="black" color="white" minW="100vw" minH="100vh">
            <Box position="absolute" top={0} left={0} width="50%" height="100%" zIndex={1} animation="rightGlowAnimation 4s linear infinite" />
            <Box position="absolute" top={0} right={0} width="50%" height="100%" zIndex={1} animation="leftGlowAnimation 4s linear infinite" />
            <Box position="relative" zIndex="1" p={4}>
                {isLoading ? (
                    <Center h="90vh">
                        <div className="loading-container">
                            <Image src="pageant-load.png" alt="Loading" boxSize="350" />
                            <div className="loading-overlay"></div>
                        </div>
                    </Center>
                ) : (
                    <>
                        <Center mb={8}>
                            <VStack>
                                <Text fontSize="4xl" fontWeight="bold" fontFamily="roboto"  textTransform="uppercase">
                                    {eventTitle || 'Loading...'}
                                </Text>
                                <Text fontWeight="bold" fontSize="2xl" mb={4}>
                                   Category: {categories[activeCategoryIndex].name}
                                </Text>
                            </VStack>
                        </Center>

                        <Center>
                            <Grid
                                templateColumns={{ base: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }}
                                gap={8}
                            >
                                {contestants.map((contestant) => (
                                    <Box key={contestant.id} p={4} bg="#333333" color="white" borderRadius="lg" maxW="32em" maxH="45em">
                                        <Flex direction="column" align="center">
                                            <Image src={`http://127.0.0.1:8000/v1/images/${contestant.image_path}`} alt={contestant.name} boxSize="200px" mb={2} />
                                            <Text fontSize="xl" fontWeight="bold">
                                                {contestant.name}
                                            </Text>
                                            <Text fontSize="md" color="gray.400">
                                                {contestant.organization}
                                            </Text>

                                            {categories.length > 0 && (
                                                <VStack align="start" spacing={4}>
                                                    {categories[activeCategoryIndex].criteria.map(criterion => (
                                                        <FormControl key={criterion.id} isRequired>
                                                            <Flex>
                                                                <FormLabel htmlFor={criterion.label} mb="0" flexShrink={0} mr={2}>
                                                                    {criterion.label}:
                                                                </FormLabel>
                                                                <InputGroup>
                                                                    <Input
                                                                        type="number"
                                                                        id={criterion.label}
                                                                        min={criterion.min_score}
                                                                        max="100"
                                                                        minW="9em"
                                                                        placeholder={`Score (Min: ${criterion.min_score})`}
                                                                        onChange={(e) => handleScoreChange(contestant.id, criterion.id, e)}
                                                                        value={scores[contestant.id]?.[criterion.id] || ''}
                                                                    />

                                                                </InputGroup>
                                                            </Flex>
                                                        </FormControl>
                                                    ))}
                                                </VStack>
                                            )}
                                        </Flex>
                                    </Box>

                                ))}
                            </Grid>
                        </Center>
                        <Center mt={6}>
                            <VStack>
                                <HStack spacing={4}>
                                    {categories.length > 0 && (
                                        <Button onClick={handleNextCategory} disabled={!allJudgesSubmitted}>
                                            Next Category
                                        </Button>
                                    )}
                                    <Button variant="primary" onClick={handleSubmitScores}>
                                        Submit
                                    </Button>
                                </HStack>
                                <Heading>
                                   Judge: {judgeName}
                                </Heading>
                            </VStack>
                        </Center>
                    </>
                )}
            </Box>

        </Box>
    );
};

export default JudgedEventPage;
