import React from 'react';
import { Table, Thead, Tbody, Tr, Th, Td, Button } from '@chakra-ui/react';

const CategoryTable = ({ categories, onManageCriteria }) => {
    return (
        <Table variant="striped" colorScheme="gray">
            <Thead>
                <Tr>
                    <Th>Name</Th>
                    <Th>Mode</Th>
                    <Th>Actions</Th>
                </Tr>
            </Thead>
            <Tbody>
                {categories.map(category => (
                    <Tr key={category.id}>
                        <Td>{category.name}</Td>
                        <Td>{category.mode === 0 ? 'Custom' : 'Referenced'}</Td>
                        <Td>
                            <Button
                                size="sm"
                                colorScheme="teal"
                                onClick={() => onManageCriteria(category.id)}
                            >
                                Manage Criteria
                            </Button>
                        </Td>
                    </Tr>
                ))}
            </Tbody>
        </Table>
    );
};

export default CategoryTable;
