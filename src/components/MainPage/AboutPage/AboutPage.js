import {Box, Container, Heading, Text, VStack, Image, Center} from "@chakra-ui/react";

const AboutPage = () => {


    return (
        <Container centerContent maxW="container.md" p={5}>
            <VStack
                spacing={8}
                align="stretch"
                bg="#863132"
                bgGradient="linear-gradient(327deg, #863132 0%, #610606 23%, #c8670a 100%);"
                p={8}
                borderRadius="lg"
                border="2px"
                borderColor="maroon"
                boxShadow="xl"
                color="white"
            >
                <Center>
                    <Image src="logo.png" boxSize='150px'/>
                </Center>
                <Box>

                    <Heading as="h3" size="lg" textAlign="center">
                        Vision
                    </Heading>
                    <Text textAlign="justify" mt={4}>
                        In 2045, the Manuel S. Enverga University Foundation is a globally competitive university with high concentrations of talent, excellent teaching environment, rigorous program quality, sufficient resources, and a culture of collaborations.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h3" size="lg" textAlign="center">
                        Mission
                    </Heading>
                    <Text textAlign="justify" mt={4}>
                        The University is a private, non-stock, non-profit, non-sectarian educational foundation with a three-fold function – instruction, research and community service offering responsive and alternative programs supportive of national development goals and standards of global excellence.
                    </Text>
                </Box>
                <Box>
                    <Heading as="h3" size="lg" textAlign="center">
                        Goal
                    </Heading>
                    <Text textAlign="justify" mt={4}>
                        Manuel S. Enverga University Foundation shall produce graduates who have research-based knowledge, leadership and managerial skills and professionalism.
                    </Text>
                </Box>
            </VStack>
        </Container>
    );
};

export default AboutPage;

