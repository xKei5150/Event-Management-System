import React, { useEffect, useState } from "react";
import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton, useDisclosure } from "@chakra-ui/react";
import { Box, Input, FormControl, FormLabel, Button, Textarea, Radio, RadioGroup, Stack, HStack } from "@chakra-ui/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import { useParams } from "react-router-dom";
import { useForm, Controller } from 'react-hook-form';

function ManageEvent() {
    const { control, handleSubmit, setValue, formState: { errors } } = useForm({
        defaultValues: {
            event_type: "",
            event_name: "",
            event_description: "",
            location: "",
            startDate: new Date(),
            endDate: new Date(),
        }
    });
    const [alert, setAlert] = useState(null);
    const { eventId } = useParams();
    const isEditing = Boolean(eventId);

    useEffect(() => {
        if (isEditing) {
            async function fetchEvent() {
                try {
                    const response = await axios.get(`http://127.0.0.1:8000/v1/events/id/${eventId}`);
                    const eventData = response.data;
                    // Use setValue to update react-hook-form's values
                    setValue('event_type', eventData.event_type);
                    setValue('event_name', eventData.event_name);
                    setValue('event_description', eventData.event_description);
                    setValue('location', eventData.location);
                    setValue('startDate', new Date(eventData.start_date));
                    setValue('endDate', new Date(eventData.end_date));
                } catch (error) {
                    console.error("Error fetching event:", error);
                }
            }
            fetchEvent();
        }
    }, [eventId, setValue]);

    const onSubmit = async (data) => {
        const method = isEditing ? 'put' : 'post';
        const url = `http://127.0.0.1:8000/v1/${isEditing ? `update-event/${eventId}/` : 'add-event/'}`;
        try {
            const response = await axios({
                method,
                url,
                data: {
                    ...data,
                    start_date: data.startDate.toISOString(),
                    end_date: data.endDate.toISOString(),
                },
            });
            setAlert({
                status: "success",
                title: isEditing ? "Event updated." : "Event added.",
                description: isEditing ? "Your event was successfully updated." : "Your event was successfully added.",
            });
        } catch (error) {
            setAlert({
                status: "error",
                title: `Error ${isEditing ? 'updating' : 'adding'} event.`,
                description: error.response?.data?.detail || "An unexpected error occurred. Please try again.",
            });
        }
    };

    const {
        isOpen: isVisible,
        onClose,
    } = useDisclosure({ defaultIsOpen: true });

    return (
        <div>
            {alert && (
                <Alert status={alert.status} mt={4}>
                    <AlertIcon />
                    <AlertTitle mr={2}>{alert.title}</AlertTitle>
                    <AlertDescription>{alert.description}</AlertDescription>
                    <CloseButton alignSelf='flex-start' position='absolute' right={-1} top={-1} onClick={onClose} />
                </Alert>
            )}
            <Box maxWidth="600px" margin="auto" mt="50px" p={4}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl isRequired mb={4}>
                        <FormLabel>Type of Event</FormLabel>
                        <Controller
                            name="event_type"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <RadioGroup {...field} isDisabled={isEditing}>
                                    <Stack direction="row">
                                        <Radio value="Judged Events" isDisabled={isEditing}>Judged Events</Radio>
                                        <Radio value="Score-based Events" isDisabled={isEditing}>Score-based Events</Radio>
                                    </Stack>
                                </RadioGroup>
                            )}
                        />
                    </FormControl>

                    <FormControl isRequired mb={4}>
                        <FormLabel>Name of Event</FormLabel>
                        <Controller
                            name="event_name"
                            control={control}
                            rules={{ required: 'Event name is required' }}
                            render={({ field }) => (
                                <Input {...field} type="text" placeholder="Enter event name" />
                            )}
                        />
                    </FormControl>

                    <FormControl isRequired mb={4}>
                        <FormLabel>Brief Description</FormLabel>
                        <Controller
                            name="event_description"
                            control={control}
                            rules={{ required: 'Event description is required' }}
                            render={({ field }) => (
                                <Textarea {...field} placeholder="Enter event description" />
                            )}
                        />
                    </FormControl>

                    <FormControl isRequired mb={4}>
                        <FormLabel>Location</FormLabel>
                        <Controller
                            name="location"
                            control={control}
                            rules={{ required: 'Location is required' }}
                            render={({ field }) => (
                                <Input {...field} type="text" placeholder="Enter location" />
                            )}
                        />
                    </FormControl>

                    <HStack>
                        <FormControl isRequired mb={4}>
                            <FormLabel>Start Date</FormLabel>
                            <Controller
                                name="startDate"
                                control={control}
                                rules={{ required: 'Start date is required' }}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select start date"
                                        onChange={(date) => field.onChange(date)}
                                        selected={field.value}
                                    />
                                )}
                            />
                        </FormControl>

                        <FormControl isRequired mb={4}>
                            <FormLabel>End Date</FormLabel>
                            <Controller
                                name="endDate"
                                control={control}
                                rules={{ required: 'End date is required' }}
                                render={({ field }) => (
                                    <DatePicker
                                        placeholderText="Select end date"
                                        onChange={(date) => field.onChange(date)}
                                        selected={field.value}
                                    />
                                )}
                            />
                        </FormControl>
                    </HStack>

                    <Button mt={4} variant="primary" type="submit">
                        {isEditing ? 'Update Event' : 'Add Event'}
                    </Button>
                </form>
            </Box>
        </div>
    );
}

export default ManageEvent;
