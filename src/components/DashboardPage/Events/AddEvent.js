import { useState } from 'react';
import {Box, Flex, FormControl, FormLabel, Input, Textarea, Checkbox, Button, Center, Heading} from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';

function NewEventsPage() {
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [description, setDescription] = useState('');
    const [place, setPlace] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [addEventDate, setAddEventDate] = useState(false);

    const handleCheckboxChange = () => {
        setAddEventDate(!addEventDate);
    };

    return (
        <Center>
            <Box bg="gray.100" p={6} borderRadius="md" width="25em">
                <Heading as="h2" size="lg" mb="4" color="red.900">
                    Add New Event
                </Heading>
                <Box bg="gray.200" p={6} borderRadius="md">
                    <FormControl mb={4}>
                        <FormLabel htmlFor="announcement-title">Announcement Title</FormLabel>
                        <Input
                            value={announcementTitle}
                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                            required
                            id="announcement-title"
                            variant="outline"
                            borderColor="black"
                            _hover={{borderColor: 'red.700'}}
                            _focus={{ borderColor: 'red.900' }}
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel htmlFor="description">Description</FormLabel>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            id="description"
                            variant="outline"
                            borderColor="black"
                            _hover={{borderColor: 'red.700'}}
                            _focus={{ borderColor: 'red.900' }}
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <FormLabel htmlFor="place">Place</FormLabel>
                        <Input
                            value={place}
                            onChange={(e) => setPlace(e.target.value)}
                            required
                            id="place"
                            variant="outline"
                            borderColor="black"
                            _hover={{borderColor: 'red.700'}}
                            _focus={{ borderColor: 'red.900' }}
                        />
                    </FormControl>

                    <FormControl mb={4}>
                        <Checkbox
                            isChecked={addEventDate}
                            onChange={handleCheckboxChange}
                        >
                            Add Event Date
                        </Checkbox>
                    </FormControl>

                    {addEventDate && (
                        <FormControl mb={4}>
                            <FormLabel>Start Date</FormLabel>
                            <DatePicker
                                selected={startDate}
                                onChange={(date) => setStartDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="yyyy-MM-dd"
                            />
                        </FormControl>
                    )}

                    {addEventDate && (
                        <FormControl mb={4}>
                            <FormLabel>End Date</FormLabel>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy-MM-dd"
                                placeholderText="yyyy-MM-dd "
                            />
                        </FormControl>
                    )}

                    <Button type="submit" variant="primary">Submit</Button>
                </Box>
            </Box>
        </Center>
    );
}

export default NewEventsPage;
