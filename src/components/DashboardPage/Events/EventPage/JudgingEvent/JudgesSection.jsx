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
import {useEffect, useState} from "react";
import AddJudgeModal from "./AddJudgeModal";
import {useParams} from "react-router-dom";
import axios from "axios";

const JudgesSection = () => {
    const [isJudgeModalOpen, setIsJudgeModalOpen] = useState(false);
    const [judgeName, setJudgeName] = useState("");
    const [loginToken, setLoginToken] = useState("");
    const [judges, setJudges] = useState([]);
    const [eventId, setEventId] = useState(null);

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

    const { eventName } = useParams();
    const formattedEventName = eventName.replace(/-/g, ' ');
    useEffect(() => {
        // Fetch the event to get its event_id
        const fetchEventAndJudges = async () => {
            try {
                const eventResponse = await axios.get(`http://127.0.0.1:8000/v1/events/${formattedEventName}`);
                const eventId = eventResponse.data.id;
                setEventId(eventId);


                // Now, fetch the list of judges for this event_id
                const judgesResponse = await axios.get(`http://127.0.0.1:8000/v1/judges/${eventId}`);
                console.log(judgesResponse.data);
                setJudges(judgesResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
                console.log(eventId);
            }
        };

        fetchEventAndJudges();
    }, [eventName]);

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
                eventId={eventId} // pass the eventId
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
