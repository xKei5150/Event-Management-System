import { Heading, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Text, Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { useState } from "react";

const PageantPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [judgeName, setJudgeName] = useState("");
    const [loginToken, setLoginToken] = useState("");
    const [judges, setJudges] = useState([]);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setJudgeName("");
        setLoginToken("");
    };

    const generateRandomToken = () => {
        const randomPart = Math.random().toString(36).substring(2, 10);
        const token = `mseufci${randomPart}`;
        setLoginToken(token);
    };

    const handleSubmit = () => {
        const newJudge = {
            name: judgeName,
            token: loginToken,
        };

        setJudges([...judges, newJudge]);

        closeModal();
    };

    return (
        <div>
            <Heading as="h2">Judges</Heading>

            <Button variant="primary" onClick={openModal} mt={4} float="right">
                Add Judge
            </Button>

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Add Judge</ModalHeader>
                    <ModalBody>
                        <Input
                            placeholder="Judge Name"
                            value={judgeName}
                            onChange={(e) => setJudgeName(e.target.value)}
                            mb={4}
                        />
                        <Input
                            placeholder="Login Token"
                            value={loginToken}
                            isReadOnly
                            mb={4}
                        />
                        <Button onClick={generateRandomToken}>Generate Token</Button>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="primary" onClick={handleSubmit}>
                            Add
                        </Button>
                        <Button variant="ghost" onClick={closeModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Table variant="simple" mt={4}>
                <Thead>
                    <Tr>
                        <Th>Judge Name</Th>
                        <Th>Login Token</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {judges.map((judge, index) => (
                        <Tr key={index}>
                            <Td>{judge.name}</Td>
                            <Td>{judge.token}</Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
        </div>
    );
};

export default PageantPage;
