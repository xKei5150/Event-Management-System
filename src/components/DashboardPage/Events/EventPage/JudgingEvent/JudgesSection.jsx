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
} from "@chakra-ui/react";
import { useState } from "react";
import AddJudgeModal from "./AddJudgeModal";

const JudgesSection = () => {
    const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
    const [judgeName, setJudgeName] = useState("");
    const [loginToken, setLoginToken] = useState("");
    const [judges, setJudges] = useState([]);

    const openJudgeModal = () => setIsJudgeModalOpen(true);
    const closeJudgeModal = () => {
        setIsJudgeModalOpen(false);
        setJudgeName("");
        setLoginToken("");
    };

    const handleJudgeSubmit = () => {
        const newJudge = { name: judgeName, token: loginToken };
        setJudges([...judges, newJudge]);
        closeJudgeModal();
    };

    const generateRandomToken = () => {
        const randomPart = Math.random().toString(36).substring(2, 10);
        const token = `mseufci${randomPart}`;
        setLoginToken(token);
    };

    return (
        <>
            <AddJudgeModal
                isOpen={isJudgeModalOpen}
                onClose={closeJudgeModal}
                onSubmit={handleJudgeSubmit}
                judgeName={judgeName}
                setJudgeName={setJudgeName}
                loginToken={loginToken}
                setLoginToken={setLoginToken}
                generateToken={generateRandomToken}
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
                        <Th>Status</Th>
                        <Th>Login Token</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {judges.map((judge, index) => (
                        <Tr key={index}>
                            <Td>{judge.name}</Td>
                            <Th>Pending Score..</Th>
                            <Td>{judge.token}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </>
    );
};

export default JudgesSection;
