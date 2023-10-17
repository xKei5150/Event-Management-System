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
    Divider,
} from '@chakra-ui/react';

const DashboardSettings = () => {
    const { handleSubmit, control } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        // Handle form submission here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>

                <Box>
                    <Box fontWeight="bold" mb={3}>Account Information</Box>

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
                    </Stack>
                </Box>

                <Divider my={6} />

                <Box>
                    <Box fontWeight="bold" mb={3}>Password Settings</Box>

                    <Stack spacing={4}>
                        <FormControl id="currentPassword">
                            <FormLabel>Current Password</FormLabel>
                            <Controller
                                name="currentPassword"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input type="password" {...field} />}
                            />
                        </FormControl>

                        <FormControl id="newPassword">
                            <FormLabel>New Password</FormLabel>
                            <Controller
                                name="newPassword"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input type="password" {...field} />}
                            />
                        </FormControl>

                        <FormControl id="confirmNewPassword">
                            <FormLabel>Confirm New Password</FormLabel>
                            <Controller
                                name="confirmNewPassword"
                                control={control}
                                defaultValue=""
                                render={({ field }) => <Input type="password" {...field} />}
                            />
                        </FormControl>
                    </Stack>
                </Box>

                <Button mt={6} type="submit" variant="primary">
                    Save Changes
                </Button>

            </Stack>
        </form>
    );
};

export default DashboardSettings;
