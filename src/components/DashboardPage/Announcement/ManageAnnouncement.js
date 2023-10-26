import {Box, Button, Checkbox, FormControl, FormLabel, Heading, Input} from '@chakra-ui/react';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { useEffect, useState } from 'react';
import {useParams} from "react-router-dom";

function ManageAnnouncements() {
    const { announcementId } = useParams();
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [description, setDescription] = useState('');
    const [location, setLocation] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [addEventDate, setAddEventDate] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const handleCheckboxChange = () => {
        setAddEventDate(!addEventDate);
    };

    useEffect(() => {
        async function fetchAnnouncementData() {
            if (announcementId) {
                try {
                    const response = await axios.get(`http://localhost:8000/v1/announcements/id/${announcementId}`);

                    setAnnouncementTitle(response.data.announcement);
                    setDescription(response.data.description);
                    setLocation(response.data.location);
                    setStartDate(response.data.startDate);
                    setEndDate(response.data.endDate);
                } catch (error) {
                    console.error("Error fetching announcement data:", error);
                    // Handle the error appropriately
                } finally {
                    setIsLoading(false);
                }
            }
        }

        fetchAnnouncementData();
    }, [announcementId]);

    const handleSubmit = async () => {
        try {
            if (announcementId) {
                // Update the existing announcement
                await axios.put(`http://localhost:8000/v1/announcements/id/${announcementId}`, {
                    announcement: announcementTitle,
                    description: description,
                    location: location,
                    startDate: startDate,
                    endDate: endDate
                });
            } else {
                // Create a new announcement
                await axios.post('http://localhost:8000/v1/add-announcement/', {
                    announcement: announcementTitle,
                    description: description,
                    location: location,
                    startDate: startDate,
                    endDate: endDate
                });
            }
            // Handle successful submission: notify the user, redirect, etc.
        } catch (error) {
            console.error("Error submitting the form:", error);
            // Handle the error appropriately
        }
    }
    const isEditing = !!announcementId;
    return (
            <Box>
                <Heading as="h2" size="lg" mb="4" color="red.900">
                    {isEditing ? "Update Announcement" : "Add New Announcement"}
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
                        <FormLabel htmlFor="place">Location</FormLabel>
                        <Input
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
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
                    <Button type="submit" variant="primary" onClick={handleSubmit}>
                        {isEditing ? "Update" : "Submit"}
                    </Button>
                </Box>
            </Box>
    )
}

export default ManageAnnouncements;
