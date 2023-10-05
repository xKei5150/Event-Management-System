import React from 'react';
import {
    IconButton,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverArrow,
    PopoverCloseButton,
    PopoverHeader,
    PopoverBody,
} from '@chakra-ui/react';
import { FiBell } from 'react-icons/fi';

const Notification = () => {
    // Replace this with your actual unread notification count
    const unreadCount = 5;

    return (
        <Popover placement="bottom-end">
            <PopoverTrigger>
                <div style={{ position: 'relative' }}>
                    <IconButton
                        size="lg"
                        variant="ghost"
                        aria-label="open notifications"
                        icon={<FiBell />}
                    />
                    {unreadCount > 0 && (
                        <div
                            style={{
                                position: 'absolute',
                                top: '-3px',
                                right: '0px',
                                backgroundColor: 'maroon',
                                color: 'white',
                                borderRadius: '45%',
                                padding: '2px 4px',
                                fontSize: '12px',
                            }}
                        >
                            {unreadCount}
                        </div>
                    )}
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader>
                    Notifications
                </PopoverHeader>
                <PopoverBody>
                    {/* Place your notification content here */}
                    {/* You can map through notifications and display them */}
                    <p>Your notification content goes here.</p>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
};

export default Notification;
