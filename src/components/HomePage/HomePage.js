import { Box, Heading, Text, Button, Image } from '@chakra-ui/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const HomePage = () => {
    return (
        <Box>
            <Box bg="maroon" py={20}>
                <Box maxW="container.xl" mx="auto" px={4}>
                    <Swiper
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        pagination={{ clickable: true }}
                        loop={true}
                    >
                        <SwiperSlide>
                            <Image src="/slider-image1.jpg" alt="Slider Image 1" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image src="/slider-image2.jpg" alt="Slider Image 2" />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Image src="/slider-image3.jpg" alt="Slider Image 3" />
                        </SwiperSlide>
                    </Swiper>

                    <Heading as="h1" size="2xl" color="white" mt={8} mb={4}>
                        Welcome to Our Company
                    </Heading>
                    <Text color="white" fontSize="xl" mb={8}>
                        We are a leading provider of innovative solutions for your business.
                    </Text>
                    <Button colorScheme="white" size="lg">
                        Get Started
                    </Button>
                </Box>
            </Box>

            <Box maxW="container.xl" mx="auto" py={20} px={4}>
                <Heading as="h2" size="xl" mb={8} color="maroon">
                    Our Services
                </Heading>

                <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={10}>
                    <Box>
                        <Heading as="h3" size="lg" mb={4}>
                            Service 1
                        </Heading>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis purus a diam
                            dictum, quis suscipit dolor mollis. Duis pellentesque tortor dolor.
                        </Text>
                    </Box>

                    <Box>
                        <Heading as="h3" size="lg" mb={4}>
                            Service 2
                        </Heading>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis purus a diam
                            dictum, quis suscipit dolor mollis. Duis pellentesque tortor dolor.
                        </Text>
                    </Box>

                    <Box>
                        <Heading as="h3" size="lg" mb={4}>
                            Service 3
                        </Heading>
                        <Text>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis purus a diam
                            dictum, quis suscipit dolor mollis. Duis pellentesque tortor dolor.
                        </Text>
                    </Box>
                </Box>
            </Box>

            <Box bg="white" py={20}>
                <Box maxW="container.xl" mx="auto" px={4}>
                    <Heading as="h2" size="xl" mb={8} textAlign="center" color="maroon">
                        About Us
                    </Heading>
                    <Text fontSize="xl" textAlign="center">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla iaculis purus a diam
                        dictum, quis suscipit dolor mollis. Duis pellentesque tortor dolor, ac pharetra enim
                        consequat sed.
                    </Text>
                </Box>
            </Box>

            <Box maxW="container.xl" mx="auto" py={20} px={4}>
                <Heading as="h2" size="xl" mb={8} textAlign="center" color="maroon">
                    Contact Us
                </Heading>
                <Text fontSize="xl" textAlign="center" mb={8}>
                    We would love to hear from you. Get in touch with us today!
                </Text>
                <Button colorScheme="maroon" size="lg" mx="auto" display="block">
                    Contact Us
                </Button>
            </Box>
        </Box>
    );
};

export default HomePage;
