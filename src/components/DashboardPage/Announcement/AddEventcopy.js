import {useState} from 'react';
import {Box, Button, Checkbox, FormControl, FormLabel, Heading, Input} from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function AddEvent() {
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
            <Box>
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
                        <ReactQuill
                            value={description}
                            onChange={setDescription}
                            modules={{
                                toolbar: [
                                    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                                    [{ header: '1' }, { header: '2' }, { font: [] }],
                                    [{ list: 'ordered' }, { list: 'bullet' },
                                        {'indent': '-1'}, {'indent': '+1'}],
                                    ['link', 'image', 'video'],
                                    ['clean'],
                                ],
                            }}
                            style={{
                                backgroundColor: 'white',
                                borderColor: 'black',
                                ':hover': { borderColor: 'red.700' },
                                ':focus': { borderColor: 'red.900' },
                            }}
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
    )
}

export default AddEvent;
