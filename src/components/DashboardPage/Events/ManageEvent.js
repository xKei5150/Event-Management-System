import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
} from '@chakra-ui/react';

const EditEvent = () => {
    const { id } = useParams(); // Get the event ID from the URL parameter
    const { control, handleSubmit, setValue } = useForm();

    useEffect(() => {
        // Simulate fetching event data based on the ID (you may fetch data from an API)
        // Replace this with actual data fetching logic
        const fetchData = async () => {
            try {
                const response = await fetch(`/api/events/${id}`); // Replace with your API endpoint
                if (response.ok) {
                    const eventData = await response.json();
                    // Populate form fields with event data
                    Object.keys(eventData).forEach((key) => {
                        setValue(key, eventData[key]);
                    });
                } else {
                    console.error('Failed to fetch event data');
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };

        fetchData();
    }, [id, setValue]);

    const onSubmit = (data) => {
        // Handle form submission (e.g., send a PUT request to your API)
        console.log('Event data submitted:', data);
        // Redirect to the event list or perform other actions as needed
    };

    return (
        <Box p="4">
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={4}>
                    <FormControl>
                        <FormLabel>Name:</FormLabel>
                        <Controller
                            name="name"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <Input {...field} />}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Date:</FormLabel>
                        <Controller
                            name="date"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <Input type="date" {...field} />}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Location:</FormLabel>
                        <Controller
                            name="location"
                            control={control}
                            defaultValue=""
                            render={({ field }) => <Input {...field} />}
                        />
                    </FormControl>
                    <Button type="submit" variant="primary">
                        Save Changes
                    </Button>
                </Stack>
            </form>
            {/* Add functionality to manage participants */}
        </Box>
    );
};

export default EditEvent;
