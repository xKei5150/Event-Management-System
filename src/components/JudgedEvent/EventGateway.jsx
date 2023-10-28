import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Center, Input, Button, Alert } from '@chakra-ui/react';
import axios from 'axios';

const EventGateway = () => {
    const [token, setToken] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/v1/judges/validate-token/${token}`);
            const { judge_id, event_name } = response.data;
            navigate(`/event/${event_name}/${judge_id}`);
        } catch (err) {
            setError("Invalid Token. Please try again.");
        }
    };

    return (
        <Box bg="white" color="black" minW="100vw" minH="100vh">
            <Center h="80vh">
                <Box>
                    <Input
                        placeholder="Enter Judge Token"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                    />
                    {error && <Alert status="error" mt={2}>{error}</Alert>}
                    <Button mt={4} onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Center>
        </Box>
    );
};

export default EventGateway;
