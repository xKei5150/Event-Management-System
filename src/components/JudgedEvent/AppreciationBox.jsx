import { Box, Text } from '@chakra-ui/react';

const AppreciationBox = ({ judgeName, eventName }) => {
    return (
        <Box
            bg="maroon"
            color="white"
            p={5}
            borderRadius="lg"
            boxShadow="lg"
            textAlign="center"
            m={5}
            borderColor="gray.200"
            borderWidth="1px"
        >
            <Text fontSize="xl" fontWeight="bold" mb={3}>
                Thank You, {judgeName}!
            </Text>
            <Text>
                Your insights and expertise greatly contributed to the success of{" "}
                <Text as="span" fontWeight="bold">
                    {eventName}.
                </Text>
            </Text>
            <Text mt={3}>We are incredibly grateful for your participation.</Text>
        </Box>
    );
};

export default AppreciationBox;
