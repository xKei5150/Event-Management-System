import {
    Button, Table, Thead, Tbody, Tr, Th, Td, HStack, Heading,
} from "@chakra-ui/react";
import { useState } from "react";
import AddContestantModal from './AddContestantModal';  // Import the new modal component

const ContestantsSection = () => {
    const [isContestantModalOpen, setIsContestantModalOpen] = useState(false);
    const [contestants, setContestants] = useState([]);
    const [contestant, setContestant] = useState({
        name: "",
        organization: "",
    });
    const [isEditing, setIsEditing] = useState(false); // New state to determine if we are in edit mode
    const [editingIndex, setEditingIndex] = useState(null);
    const openContestantModal = () => setIsContestantModalOpen(true);
    const closeContestantModal = () => {
        setIsContestantModalOpen(false);
        setContestant({ name: "", organization: "" });
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
            setIsEditing(false); // Reset edit mode
            setEditingIndex(null); // Clear the editing index
        } else {
            setContestants([...contestants, contestantData]);
        }
        closeContestantModal();
    };



    return (
        <>
            <AddContestantModal
                isOpen={isContestantModalOpen}
                onClose={closeContestantModal}
                onSubmit={handleContestantSubmit}
                contestant={contestant}
                setContestant={setContestant}
                isEditing={isEditing}
            />

            <HStack>
                <Heading as="h2" mt={10}>Contestants</Heading>
                <Button variant="outline" colorScheme="red" onClick={openContestantModal} mt={4}>
                    Add Contestant
                </Button>
            </HStack>
            <Table variant="simple" mt={4}>
                <Thead>
                    <Tr>
                        <Th>No.</Th>
                        <Th>Name</Th>
                        <Th>Organization</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {contestants.map((contestant, index) => (
                        <Tr key={index}>
                            <Td>{index + 1}</Td>
                            <Td>{contestant.name}</Td>
                            <Td>{contestant.organization}</Td>
                            <Td>
                                {/* Example of edit functionality.
                     Further functionality can be implemented based on requirements */}
                                <Button variant="ghost" onClick={() => openEditModal(index)}>Edit</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>

        </>
    );
};

export default ContestantsSection;
