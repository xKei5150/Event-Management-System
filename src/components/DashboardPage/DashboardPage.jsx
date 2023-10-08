import React from 'react';
import {
    Box,
    Heading,
    Text,
    Center,
    Stack,
    Image,
    Divider, Avatar,
} from '@chakra-ui/react';

const DashboardPage = () => {
    return (
        <Box p="4" bg="">
            <Stack direction="row" spacing="4" align="center" mt="4">
                <Avatar
                    size={'2xl'}
                    src={
                        'https://wotpack.ru/wp-content/uploads/2023/06/word-image-256721-1.jpg'
                    }
                />
                <Box>
                    <Text fontSize="xl">Von Maverick</Text>
                    <Text fontSize="sm">Admin</Text>
                </Box>
            </Stack>
            <Divider my="4" />
            <Stack spacing="4">
                <Text fontSize="xl">ASDGDSfg</Text>
                <Text>
                    Ad
                </Text>
                <Text>Em</Text>
                <Text>Pho</Text>
            </Stack>
        </Box>
    );
}

export default DashboardPage;
