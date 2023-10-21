import React, { useState } from "react";
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

function AddEvent() {
    const [eventType, setEventType] = useState("");
    const [eventName, setEventName] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [location, setLocation] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const handleSubmit = (e) => {
        e.preventDefault();
        const eventDetails = {
            eventType,
            eventName,
            eventDescription,
            location,
            startDate,
            endDate,
        };
        console.log(eventDetails);
        // You can now send `eventDetails` to your backend or any desired action
    };

    return (
        <Box maxWidth="600px" margin="auto" mt="50px" p={4}>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired mb={4}>
                    <FormLabel>Type of Event</FormLabel>
                    <RadioGroup onChange={setEventType} value={eventType}>
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
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </FormControl>

                <FormControl isRequired mb={4}>
                    <FormLabel>Brief Description</FormLabel>
                    <Textarea
                        placeholder="Enter event description"
                        value={eventDescription}
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
    );
}

export default AddEvent;
