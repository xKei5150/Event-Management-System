import React, {useState} from 'react';
import {
    Box,
    HStack,
    FormControl,
    FormLabel,
    Input,
    NumberInput,
    NumberInputField,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    Select,
    Spinner,
} from "@chakra-ui/react";
import { useForm, useFieldArray } from 'react-hook-form';

// Assuming fetchCategory, fetchCategoryDetails, fetchCriteria, updateCategory are correctly implemented
import { fetchCategory, fetchCategoryDetails, fetchCriteria, updateCategory } from "./categoryAPI";

const CriteriaModal = ({ isOpen, onClose, allCategories, categoryId }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [category, setCategory] = React.useState(null);
    const [mode, setMode] = useState(null);
    const { register, control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            customCriteria: [],
            referencedCriteria: [],
        }
    });
    const { fields: customCriteriaFields, append: appendCustomCriteria, remove: removeCustom } = useFieldArray({
        control,
        name: "customCriteria"
    });
    const { fields: referencedCriteriaFields, append: appendReferencedCriteria, remove: removeReference } = useFieldArray({
        control,
        name: "referencedCriteria"
    });

    React.useEffect(() => {
        const fetchDataForCategory = async () => {
            setIsLoading(true);
            try {
                const fetchedCategory = await fetchCategory(categoryId);
                setCategory(fetchedCategory);
                setMode(fetchedCategory.mode);
                const fetchedCriteria = await fetchCriteria(categoryId);
                // Assuming fetchedCriteria is an object with custom_criteria and referenced_criteria arrays
                setValue('customCriteria', fetchedCriteria.custom_criteria);
                setValue('referencedCriteria', fetchedCriteria.referenced_criteria);
            } catch (error) {
                console.error('Error fetching data for category:', error);
            }
            setIsLoading(false);
        };

        if (categoryId) {
            fetchDataForCategory();
        }
    }, [categoryId, setValue]);

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            // Assuming updateCategory API is expecting the correct format
            await updateCategory(categoryId, data.customCriteria, data.referencedCriteria);
            onClose();
        } catch (error) {
            console.error('Error updating category:', error);
        }
        setIsLoading(false);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Manage {category?.name}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {isLoading ? (
                        <Spinner />
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)}>
                            {!mode ? (
                                <>
                                    <Box>
                                        {customCriteriaFields.map((field, index) => (
                                            <HStack key={field.id} width="full" spacing={4}>
                                                <FormControl flex="2">
                                                    <FormLabel htmlFor={`customCriteria[${index}].label`}>Criteria Label</FormLabel>
                                                    <Input
                                                        id={`customCriteria[${index}].label`}
                                                        {...register(`customCriteria.${index}.label`)}
                                                    />
                                                </FormControl>
                                                <FormControl flex="1">
                                                    <FormLabel htmlFor={`customCriteria[${index}].min`}>Minimum Percentage</FormLabel>
                                                    <NumberInput min={0} max={100}>
                                                        <NumberInputField
                                                            id={`customCriteria[${index}].min`}
                                                            {...register(`customCriteria.${index}.min`, { valueAsNumber: true })}
                                                        />
                                                    </NumberInput>
                                                </FormControl>
                                                <FormControl flex="1">
                                                    <FormLabel htmlFor={`customCriteria[${index}].max`}>Maximum Percentage</FormLabel>
                                                    <NumberInput min={0} max={100}>
                                                        <NumberInputField
                                                            id={`customCriteria[${index}].max`}
                                                            {...register(`customCriteria.${index}.max`, { valueAsNumber: true })}
                                                        />
                                                    </NumberInput>
                                                </FormControl>
                                                <Button onClick={() => removeCustom(index)}>Delete</Button>
                                            </HStack>
                                        ))}
                                    </Box>
                                    <Button variant="link" onClick={() => appendCustomCriteria({ label: "", min: 0, max: 100 })}>
                                        + Add Custom Criteria
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Box>
                                        {referencedCriteriaFields.map((field, index) => (
                                            <HStack key={field.id} width="full" spacing={4}>
                                                <FormControl flex="1">
                                                    <FormLabel htmlFor={`referencedCriteria[${index}].reference_id`}>Reference</FormLabel>
                                                    <Select
                                                        id={`referencedCriteria[${index}].reference_id`}
                                                        {...register(`referencedCriteria.${index}.reference_id`, { valueAsNumber: true })}
                                                        placeholder="Select Reference"
                                                    >
                                                        {allCategories.map((category) => (
                                                            <option key={category.category_id} value={category.category_id}>
                                                                {category.category_name} from {category.event_name}
                                                            </option>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <FormControl flex="1">
                                                    <FormLabel htmlFor={`referencedCriteria[${index}].percentage`}>Percentage</FormLabel>
                                                    <NumberInput min={0} max={100}>
                                                        <NumberInputField
                                                            id={`referencedCriteria[${index}].percentage`}
                                                            {...register(`referencedCriteria.${index}.percentage`, { valueAsNumber: true })}
                                                        />
                                                    </NumberInput>
                                                </FormControl>
                                                <Button onClick={() => removeReference(index)}>Delete</Button>
                                            </HStack>
                                        ))}
                                    </Box>
                                    <Button variant="link" onClick={() => appendReferencedCriteria({ reference_id: 0, percentage: 0 })}>
                                        + Add Referenced Criteria
                                    </Button>
                                </>
                            )}
                            <ModalFooter>
                                <Button colorScheme="teal" mr={3} type="submit">
                                    Save
                                </Button>
                                <Button variant="ghost" onClick={handleClose}>
                                    Cancel
                                </Button>
                            </ModalFooter>
                        </form>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default CriteriaModal;
