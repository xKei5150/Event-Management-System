import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Textarea,
    Select,
} from '@chakra-ui/react';

const DashboardSettings = () => {
    const { handleSubmit, control } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        // Handle form submission here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
                <FormControl id="name">
                    <FormLabel>Name</FormLabel>
                    <Controller
                        name="name"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} />}
                    />
                </FormControl>

                <FormControl id="email">
                    <FormLabel>Email Address</FormLabel>
                    <Controller
                        name="email"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Input {...field} />}
                    />
                </FormControl>

                <FormControl id="bio">
                    <FormLabel>Bio</FormLabel>
                    <Controller
                        name="bio"
                        control={control}
                        defaultValue=""
                        render={({ field }) => <Textarea {...field} />}
                    />
                </FormControl>

                <Button type="submit" variant="primary">
                    Save Changes
                </Button>
            </Stack>
        </form>
    );
};

export default DashboardSettings;
