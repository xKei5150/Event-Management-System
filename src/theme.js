// src/theme.js
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    colors: {
        // Add your custom color scheme here
        customRed: '#900000', // Replace this with your desired red color
        customMaroon: '#780000', // Replace this with your desired maroon color
    },
    components: {
        Button: {
            // Add your custom button styles here, using the custom colors defined above
            baseStyle: {
                fontWeight: 'bold',
            },
            variants: {
                primary: {
                    bg: 'customRed', // Use the customRed color for the primary variant
                    color: 'white', // Text color for the primary variant
                    _hover: {
                        bg: 'customMaroon', // Use the customMaroon color on hover
                    },
                },
            },
        },
    },
});

export default theme;
