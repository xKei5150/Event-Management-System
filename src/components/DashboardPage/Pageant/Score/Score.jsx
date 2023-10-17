import {Button, Heading, HStack, Table, Tbody, Td, Th, Thead, Tr} from "@chakra-ui/react";

const Score = () => {
    return (
        <div>
            <HStack>
                <Heading as="h2" mt={10}>
                    Scores
                </Heading>
                <Button variant="outline" colorScheme="red" mt={4}>
                    Manage Evaluation
                </Button>
            </HStack>
            <Table variant="simple" mt={4}>
                <Thead>
                    <Tr>
                        <Th>Judge ID</Th>
                        <Th>Contestant</Th>
                        <Th>(TO BE FILLED)</Th>
                        <Th>Action</Th>
                    </Tr>
                </Thead>
                <Tbody>
                        <Tr>
                            <Th></Th>
                        </Tr>
                </Tbody>
            </Table>
        </div>
        )
}
export default Score;