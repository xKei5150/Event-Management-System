// ManageAnnouncements.jsx
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Controller, useForm} from 'react-hook-form';
import { Box, Button, Checkbox, FormControl, FormLabel, Heading, Input, useToast } from '@chakra-ui/react';
import ReactQuill from 'react-quill';
import DatePicker from 'react-datepicker';
import 'react-quill/dist/quill.snow.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';

import { useParams, useNavigate  } from "react-router-dom";

function ManageAnnouncements() {
    const { announcementId } = useParams();
    const { register, control, handleSubmit, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            addEventDate: false,
        },
    });
    const isEditing = !!announcementId;
    const addEventDate = watch('addEventDate', false);
    const toast = useToast();
    const navigate = useNavigate();
    const quillRef = useRef(null);




    useEffect(() => {
        if (announcementId) {
            // Fetch the existing announcement data to prefill the form
            axios.get(`http://localhost:8000/v1/announcements/id/${announcementId}`)
                .then(response => {
                    const data = response.data;
                    // Prefill the form
                    setValue('announcement', data.announcement);
                    setValue('description', data.description);
                    setValue('location', data.location);
                    setValue('startDate', data.startDate ? new Date(data.startDate) : null);
                    setValue('endDate', data.endDate ? new Date(data.endDate) : null);

                    // Automatically check the addEventDate checkbox if dates are   available
                    setValue('addEventDate', !!(data.startDate || data.endDate));
                })
                .catch(error => {
                    console.error("Error fetching announcement data:", error);
                });
        }
    }, [announcementId, setValue]);

    const onSubmit = async (data) => {
        try {
            if (isEditing) {
                await axios.put(`http://localhost:8000/v1/announcements/id/${announcementId}`, data);
                toast({
                    title: 'Announcement updated.',
                    description: 'The announcement has been successfully updated.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            } else {
                await axios.post('http://localhost:8000/v1/add-announcement/', data);
                toast({
                    title: 'Announcement created.',
                    description: 'A new announcement has been successfully created.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            }
            navigate(-1);
        } catch (error) {
            console.error("Error submitting the form:", error);
            toast({
                title: 'An error occurred.',
                description: 'Unable to submit the form. Please try again.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top',
            });
        }
    };


    const QuillEditor = React.forwardRef((props, ref) => (
        <ReactQuill ref={ref} {...props} />
    ));



    const imageHandler = useCallback(() => {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');

        // Save the current range
        const currentRange = quillRef.current.getEditor().getSelection();

        input.click();

        input.onchange = async () => {
            const file = input.files[0];
            if (file) {
                const formData = new FormData();
                formData.append('image', file);

                const uploadUrl = 'http://localhost:8000/v1/upload-image';

                try {
                    const response = await axios.post(uploadUrl, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    const imageUrl = response.data.url;
                    console.log('Image URL:', imageUrl); // Log the URL to verify it

                    if (quillRef.current) {
                        const editor = quillRef.current.getEditor();
                        // Restore the selection if it was lost
                        if (currentRange) {
                            editor.setSelection(currentRange);
                        }
                        const range = editor.getSelection(true);

                        if (range) {
                            editor.insertEmbed(range.index, 'image', imageUrl);
                        } else {
                            // Fallback to insert at the end of the editor content
                            const length = editor.getLength();
                            editor.insertEmbed(length, 'image', imageUrl);
                        }
                    } else {
                        console.error("The editor has not been initialized yet.");
                        toast({
                            title: 'Editor not ready.',
                            description: 'The editor is not yet ready to insert the image.',
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                            position: 'top',
                        });
                    }
                } catch (error) {
                    console.error('Error uploading image: ', error);
                    toast({
                        title: 'Image upload failed.',
                        description: 'Could not upload image. Please try again.',
                        status: 'error',
                        duration: 5000,
                        isClosable: true,
                        position: 'top',
                    });
                }
            }
        };
    }, [toast]);



    const modules = useMemo(() => ({
        toolbar: {
            container: [
                ['bold', 'italic', 'underline', 'strike', 'blockquote'],
                [{ header: '1' }, { header: '2' }, { font: [] }],
                [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
                ['link', 'image', 'video'],
                ['clean'],
            ],  'handlers': {
                image: imageHandler,
            }
        }
    }), [imageHandler])

    return (
        <Box minW="75vh" mx="auto" mt="5" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Heading as="h2" size="xl" mb="4" bg="maroon" color="white" textAlign="center" py="2">
                {isEditing ? "UPDATE ANNOUNCEMENT" : "ADD NEW ANNOUNCEMENT"}
            </Heading>
            <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                bg="gray.200"
                p={6}
                borderRadius="md"
                boxShadow="md"
            >
                <FormControl mb={4} isInvalid={errors.announcement}>
                    <FormLabel htmlFor="announcement-title">Announcement Title</FormLabel>
                    <Input {...register('announcement', { required: 'This field is required' })} id="announcement-title" placeholder="Enter title here" />
                    {errors.announcement && <Box color="red.500" fontSize="sm">{errors.announcement.message}</Box>}
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel htmlFor="description">Description</FormLabel>
                    <Controller
                        control={control}
                        name="description"
                        render={({ field }) => (
                            <QuillEditor
                                {...field}
                                modules={modules}
                                ref={quillRef}
                                style={{
                                    minHeight: "200px",
                                    overflowY: "auto",
                                    backgroundColor: 'white',
                                    borderColor: 'gray.300',
                                }}
                            />
                        )}
                    />
                </FormControl>

                <FormControl mb={4}>
                    <FormLabel htmlFor="place">Location</FormLabel>
                    <Input {...register('location')} id="place" placeholder="Enter location here" />
                </FormControl>

                <FormControl mb={4} display="flex" alignItems="center">
                    <Checkbox {...register('addEventDate')} mr="2">Add Event Date</Checkbox>
                </FormControl>

                {addEventDate && (
                    <Box mb={4}>
                        <Controller
                            control={control}
                            name="startDate"
                            render={({ field }) => (
                                <DatePicker
                                    placeholderText="Select start date"
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    dateFormat="yyyy-MM-dd"
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="endDate"
                            render={({ field }) => (
                                <DatePicker
                                    placeholderText="Select end date"
                                    onChange={(date) => field.onChange(date)}
                                    selected={field.value}
                                    dateFormat="yyyy-MM-dd"
                                />
                            )}
                        />
                    </Box>
                )}

                <Button
                    colorScheme="blue"
                    type="submit"
                    w="full"
                    mt="4"
                    _hover={{
                        transform: 'scale(1.02)',
                    }}
                    _active={{
                        transform: 'scale(0.98)',
                    }}
                >
                    {isEditing ? "Update" : "Submit"}
                </Button>
            </Box>
        </Box>
    );
};


export default ManageAnnouncements;
