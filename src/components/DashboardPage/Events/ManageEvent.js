import React, {useEffect, useState} from "react";
import {Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, useDisclosure} from "@chakra-ui/react";
import {
    Box,
    Input,
    FormControl,
    FormLabel,
    Button,
    Textarea,
    Radio,
    RadioGroup,
    Stack, HStack,
} from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import {useParams} from "react-router-dom";

function ManageEvent() {
    const [event_type, setEventType] = useState("");
    const [event_name, setEventName] = useState("");
    const [event_description, setEventDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [alert, setAlert] = useState(null);
    const { eventId } = useParams();

    useEffect(() => {
        async function fetchEvent() {
            if (eventId) { // Only fetch if eventId exists
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/v1/events/id/${eventId}`);
                    const eventData = response.data;
                    setEventType(eventData.event_type);
                    setEventName(eventData.event_name);
                    setEventDescription(eventData.event_description);
                    setLocation(eventData.location);
                    setStartDate(new Date(eventData.start_date));
                    setEndDate(new Date(eventData.end_date));
                } catch (error) {
                    console.error("Error fetching event:", error);
                }
            }
        }
        fetchEvent();
    }, [eventId]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventDetails = {
            event_type,
            event_name,
            event_description,
            location,
            start_date: startDate.toISOString(),  // Convert to ISO string
            end_date: endDate.toISOString(),
        };
        console.log(eventDetails);
        try {
            const response = await axios.post('http://127.0.0.1:8000/v1/add-event/', eventDetails);
            console.log(response.data);
            setAlert({
                status: "success",
                title: "Event added.",
                description: "Your event was successfully added.",
            });
        } catch (error) {
            console.error("Error adding event:", error);
            // Handle error
            setAlert({
                status: "error",
                title: "Error adding event.",
                description: error.response?.data?.message || "An unexpected error occurred. Please try again.",
            });
        }
    };
    const {
        isOpen: isVisible,
        onClose,
        onOpen,
    } = useDisclosure({ defaultIsOpen: true })
    return (
        <div>
        {alert && (
            <Alert status={alert.status} mt={4}>
                <AlertIcon />
                <AlertTitle mr={2}>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
                <CloseButton
                    alignSelf='flex-start'
                    position='right'
                    right={-1}
                    top={-1}
                    onClick={onClose}
                />
            </Alert>
        )}
        <Box maxWidth="600px" margin="auto" mt="50px" p={4}>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired mb={4}>
                    <FormLabel>Type of Event</FormLabel>
                    <RadioGroup onChange={setEventType} value={event_type}>
                        <Stack direction="row">
                            <Radio value="Judged Events">Judged Events</Radio>
                            <Radio value="Score-based Events">Score-based Events</Radio>
                        </Stack>
                    </RadioGroup>
                </FormControl>

                <FormControl isRequired mb={4}>
                    <FormLabel>Name of Event</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter event name"
                        value={event_name}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </FormControl>

                <FormControl isRequired mb={4}>
                    <FormLabel>Brief Description</FormLabel>
                    <Textarea
                        placeholder="Enter event description"
                        value={event_description}
                        onChange={(e) => setEventDescription(e.target.value)}
                    />
                </FormControl>

                <FormControl isRequired mb={4}>
                    <FormLabel>Location</FormLabel>
                    <Input
                        type="text"
                        placeholder="Enter location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </FormControl>
                <HStack>
                    <FormControl isRequired mb={4}>
                        <FormLabel>Start Date</FormLabel>
                        <DatePicker
                            selected={startDate}
                            onChange={(date) => setStartDate(date)}
                        />
                    </FormControl>

                    <FormControl isRequired mb={4}>
                        <FormLabel>End Date</FormLabel>
                        <DatePicker
                            selected={endDate}
                            onChange={(date) => setEndDate(date)}
                        />
                    </FormControl>
                </HStack>


                <Button mt={4} variant="primary" type="submit">
                    Add Event
                </Button>
            </form>
        </Box>
        </div>
    );
}

export default ManageEvent;
