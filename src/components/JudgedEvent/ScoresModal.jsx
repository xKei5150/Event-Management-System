import React, { useEffect, useState } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td
} from '@chakra-ui/react';
import axios from 'axios';

const ScoresModal = ({ isOpen, currentCategoryId, currentLevel, judgeId, onEdit, onNextLevel, onClose }) => {
    const [organizedScores, setOrganizedScores] = useState([]);
    const [criteriaHeaders, setCriteriaHeaders] = useState([]);
    const [categoryName, setCategoryName] = useState('');


    useEffect(() => {
        if (isOpen) {
            const fetchScores = async () => {
                try {
                    const response = await axios.get(`http://localhost:8000/v1/scores/submitted-scores/?judge_id=${judgeId}&category_id=${currentCategoryId}&level=${currentLevel}`);
                    processScores(response.data);
                } catch (error) {
                    console.error('Error fetching scores:', error);
                }
            };
            fetchScores();
        }
    }, [isOpen, judgeId, currentCategoryId, currentLevel]);

    const processScores = (scores) => {
        const criteriaMap = {};
        const contestantsScores = {};

        // Extract unique criteria, including max scores, and initialize contestant scores
        scores.forEach(({ id, score, contestant_name, criteria_name, max }) => {
            criteriaMap[criteria_name] = { max, criteria_id: criteria_name };
            setCategoryName(score.category_name);

            if (!contestantsScores[contestant_name]) {
                contestantsScores[contestant_name] = { scores: {} };
            }

            // Calculate the percentage of the score
            const percentageScore = max ? (max / 100 * score) : 0;
            contestantsScores[contestant_name].scores[criteria_name] = {
                score,
                percentageScore,
                id
            };
        });

        // Convert the data into the structure for rendering
        setOrganizedScores(contestantsScores);
        setCriteriaHeaders(Object.keys(criteriaMap).map(criteria => ({
            criteria,
            max: criteriaMap[criteria].max
        })));
    };

    const handleEditClick = () => {
        onEdit(); // Perform the edit actions
        onClose(); // Close the modal
    };

    const handleNextLevelClick = () => {
        onNextLevel(); // Perform the next level actions
        onClose(); // Close the modal
    };


    return (
        <Modal isOpen={isOpen} isCentered closeOnOverlayClick={false} size="xl">
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Scores for Category {categoryName}</ModalHeader>
                <ModalBody>
                    <Table variant="simple">
                        <Thead>
                            <Tr>
                                <Th>Contestant</Th>
                                {criteriaHeaders.map(({ criteria, max }) => (
                                    <Th key={criteria}>{`${criteria} (${max}%)`}</Th>
                                ))}
                            </Tr>
                        </Thead>
                        <Tbody>
                            {Object.entries(organizedScores).map(([contestantName, { scores }]) => (
                                <Tr key={contestantName}>
                                    <Td>{contestantName}</Td>
                                    {criteriaHeaders.map(({ criteria }) => (
                                        <Td key={criteria}>
                                            {scores[criteria] ? `${scores[criteria].score} (${scores[criteria].percentageScore.toFixed(2)}%)` : 'N/A'}
                                        </Td>
                                    ))}
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleEditClick}>
                            Edit
                        </Button>
                        <Button variant="ghost" onClick={handleNextLevelClick}>
                            Next Level
                        </Button>
                    </ModalFooter>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ScoresModal;