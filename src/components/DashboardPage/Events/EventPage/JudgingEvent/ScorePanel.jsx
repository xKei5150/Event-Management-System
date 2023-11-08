import React, { useState, useEffect } from 'react';
import {
    Box,
    VStack,
    Accordion,
    AccordionItem,
    AccordionButton,
    AccordionPanel,
    AccordionIcon,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    Select,
} from '@chakra-ui/react';
import axios from 'axios';

const ScorePanel = ({ eventId }) => {
    const [levels, setLevels] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState('');
    const [categories, setCategories] = useState([]);
    const [scores, setScores] = useState([]);
    const [overallScores, setOverallScores] = useState({});
    const [detailedScores, setDetailedScores] = useState({});
    const [categoryNames, setCategoryNames] = useState({});

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const levelsResponse = await axios.get(`http://localhost:8000/v1/distinct-levels/${eventId}`);
                const levelsData = levelsResponse.data;
                setLevels(levelsData);


                const categoriesResponse = await axios.get(`http://localhost:8000/v1/event-categories/${eventId}`);
                const categoriesData = categoriesResponse.data;
                setCategories(categoriesData);

                const categoryNamesMap = categoriesData.reduce((acc, category) => {
                    acc[category.id] = category.name;
                    return acc;
                }, {});
                setCategoryNames(categoryNamesMap);

            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };

        fetchInitialData();
    }, [eventId]);

    useEffect(() => {
        if (levels.length > 0 && !selectedLevel) {
            setSelectedLevel(levels[0]);
        }
    }, [levels]);
    useEffect(() => {
        if (selectedLevel) {
            fetchScores(selectedLevel);
        }
    }, [selectedLevel]);


    const fetchScores = async (level) => {
        try {
            const scoresResponse = await axios.get(`http://localhost:8000/v1/calculate-scores/${eventId}/?level=${level}`);
            setScores(scoresResponse.data);

            const overallScoresResponse = await axios.get(`http://localhost:8000/v1/calculate-category-by-reference-scores/${eventId}/?level=${level}`);
            setOverallScores(overallScoresResponse.data.overall_scores);
            console.log(detailedScores);
            setDetailedScores(overallScoresResponse.data.detailed_scores);
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    };

    const OverallScoresTable = ({ categoryId, overallScores, detailedScores, categoryNames }) => {
        // Get the detailed scores for this particular category
        const detailedScoresForCategory = detailedScores[categoryId];
        const uniqueCategoryIds = new Set();
        Object.values(detailedScoresForCategory).forEach((detailsArray) => {
            detailsArray.forEach((detail) => {
                uniqueCategoryIds.add(detail.category_id);
            });
        });

        const categoryHeaders = Array.from(uniqueCategoryIds).map((categoryId) => (
            <Th key={categoryId}>{categoryNames[categoryId]}</Th>
        ));
        return (
            <Table variant="simple">
                <Thead>
                    <Tr>
                        <Th>Contestant No.</Th>
                        {categoryHeaders}
                        <Th isNumeric>Overall Score</Th>
                        <Th>Rank</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {overallScores[categoryId].map((contestant, idx) => (
                        <Tr key={idx}>
                            <Td>{contestant.contestant_number}</Td>
                            {Object.values(detailedScoresForCategory[contestant.contestant_number]).map((detail, index) => (
                                <Td key={index} isNumeric>
                                    {detail.weighted_score.toFixed(2)}%
                                </Td>
                            ))}
                            <Td isNumeric>{contestant.overall_score.toFixed(2)}%</Td>
                            <Td>{contestant.rank}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        );
    };




    return (
        <VStack spacing={4}>
            <Box width="100%">
                <Select
                    placeholder="Select level"
                    value={selectedLevel}
                    onChange={(e) => {
                        const newLevel = e.target.value;
                        setSelectedLevel(newLevel);
                        fetchScores(newLevel); // Directly call fetchScores here
                    }}
                >
                    {levels.map((level) => (
                        <option key={level} value={level}>Level {level}</option>
                    ))}
                </Select>
            </Box>

            {scores.length > 0 && (
                <Accordion allowMultiple defaultIndex={categories.map((_, idx) => idx)} width="100%">
                    {scores.map((categoryScore, idx) => (
                        <AccordionItem key={idx}>
                            <AccordionButton bg='maroon' color="white" _hover={{ bg: "teal.600" }}>
                                <Box flex="1" textAlign="left" >
                                    {categoryScore.category_name}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Box overflowX="auto">
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Contestant No.</Th>
                                            {categoryScore.contestant_scores[0].scores.map((score, idx) => (
                                                <Th key={idx}>Judge {idx+1}</Th>
                                            ))}
                                            <Th isNumeric>Total Percentage</Th>
                                            <Th>Rank</Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {categoryScore.contestant_scores.map((contestantScore, idx) => (
                                            <Tr key={idx}>
                                                <Td>{contestantScore.contestant_number}</Td>
                                                {contestantScore.scores.map((score, idx) => (
                                                    <Td key={idx} isNumeric>{score.score.toFixed(2)}</Td>
                                                ))}
                                                <Td isNumeric>{contestantScore.total_percentage.toFixed(2)}%</Td>
                                                <Td>{contestantScore.rank}</Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                                </Box>
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
            <Accordion allowMultiple width="100%">
                {Object.keys(overallScores).length > 0 && (
                    <Accordion allowMultiple width="100%">
                        {Object.entries(overallScores).map(([categoryId, contestantScores]) => (
                            <AccordionItem key={categoryId}>
                                <AccordionButton bg='maroon' color="white" _hover={{ bg: "teal.600" }}>
                                    <Box flex="1" textAlign="left">
                                        {categoryNames[categoryId]}
                                    </Box>
                                    <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel pb={4} >
                                    <Box overflowX="auto">
                                    <OverallScoresTable
                                        categoryId={categoryId}
                                        overallScores={overallScores}
                                        detailedScores={detailedScores}
                                        categoryNames={categoryNames}
                                    />
                                    </Box>
                                </AccordionPanel>
                            </AccordionItem>
                        ))}
                    </Accordion>
                )}
            </Accordion>
        </VStack>
    );
};

export default ScorePanel;
