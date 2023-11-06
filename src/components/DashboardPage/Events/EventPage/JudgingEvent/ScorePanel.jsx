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
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [categories, setCategories] = useState([]);
    const [scores, setScores] = useState([]);

    useEffect(() => {
        // Fetch levels and categories when the component mounts or event_id changes
        // This is a placeholder - you'll need to implement fetching of levels and categories
        const fetchInitialData = async () => {
            const levelsResponse = await axios.get(`http://localhost:8000/v1/distinct-levels/${eventId}`); // Replace with your actual API
            if (levelsResponse.data.length > 0) {
                setLevels(levelsResponse.data);
                setSelectedLevel(levelsResponse.data[0]);
                fetchScores(selectedLevel)
            }

            const categoriesResponse = await axios.get(`http://localhost:8000/v1/event-categories/${eventId}`); // Replace with your actual API
            setCategories(categoriesResponse.data);
        };

        fetchInitialData();
    }, [eventId]);

    const fetchScores = async (level) => {
        try {
            const response = await axios.get(`http://localhost:8000/v1/calculate-scores/${eventId}/?level=${level}`);
            setScores(response.data);
        } catch (error) {
            console.error('Error fetching scores:', error);
        }
    };

    useEffect(() => {
        if (selectedLevel !== null) {
            // Only fetch scores if a level is actually selected
            fetchScores(selectedLevel);
        }
    }, [selectedLevel]);

    return (
        <VStack spacing={4}>
            <Box width="100%">
                <Select
                    placeholder="Select level"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
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
                            <AccordionButton>
                                <Box flex="1" textAlign="left">
                                    {categoryScore.category_name}
                                </Box>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <Table variant="simple">
                                    <Thead>
                                        <Tr>
                                            <Th>Contestant Number</Th>
                                            {categoryScore.contestant_scores[0].scores.map((score, idx) => (
                                                <Th key={idx}>Judge {score.judge_id}</Th>
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
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>
            )}
        </VStack>
    );
};

export default ScorePanel;
