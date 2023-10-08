import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import Rating from 'react-rating-stars-component';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Text,
    Textarea,
    VStack,
    HStack,
    Stack, Center
} from "@chakra-ui/react"

function EvaluationForm() {
    const { control, handleSubmit, register } = useForm();
    const [evaluationLabels, setEvaluationLabels] = useState([]);

    useEffect(() => {
        const fetchedLabels = [
            "The activity / event started on time.",
            "The activity / event finished on time.",
            "Stage decorations exhibited creativity and appropriateness.",
            "Quality sound system and lights were used. No technical issues experienced.",
            "The activity/ event showcased entertainment.",
            "The host was eloquent (expressive/fluent).",
            "Each part of the program was logically arranged",
            "There were clear guidelines and announcement of criteria.",
        ];

        setEvaluationLabels(fetchedLabels);
    }, []);

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <Center>
    <Box
        w="40%" maxW="40%"
        bg="gray.100" p={4}
        borderRadius="md"
        boxShadow="md" mb={4}
        border="2px solid maroon"
    >
        <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing="4">
                <FormControl isRequired>
                    <FormLabel>Event Rating</FormLabel>
                    <Controller
                        name="rating"
                        control={control}
                        defaultValue={0}
                        render={({ field }) => (
                            <>
                                {evaluationLabels.map((label, index) => (

                                        <Stack spacing={3} key={index}>
                                            <Text>{`${index + 1}. ${label}`}</Text>
                                            <Rating
                                                count={5}
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                                size={50}
                                                color="gray"
                                                activeColor="maroon"
                                            />
                                        </Stack>

                                ))}
                            </>
                        )}
                    />
                </FormControl>

                <FormControl isRequired>
                    <FormLabel>Comments</FormLabel>
                    <Textarea bgColor="white" {...register("comments")} />
                </FormControl>

                <Button type="submit" colorScheme="teal">Submit</Button>
            </VStack>
        </form>
    </Box>
        </Center>
    );
}

export default EvaluationForm;
