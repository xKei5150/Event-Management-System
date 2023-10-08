import { Box, Text } from '@chakra-ui/react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './homeStyles.css'; // Import the custom CSS file

const images = [
    { src: '/Homepage/image1.jpg', alt: 'Image 1' },
    { src: '/Homepage/image2.jpg', alt: 'Image 2' },
    { src: '/Homepage/image3.jpg', alt: 'Image 3' },
    { src: '/Homepage/image4.jpg', alt: 'Image 4' },
    { src: '/Homepage/image5.jpg', alt: 'Image 5' },
    { src: '/Homepage/image6.jpg', alt: 'Image 6' },
];

const HomePage = () => {
    return (
        <Box bg="red.900">
            <Carousel showThumbs={false} showStatus={false} autoPlay={true} interval={5000} infiniteLoop>
                {images.map((image, index) => (
                    <div key={index} className="carousel-slide">
                        <div className="carousel-image-container">
                            <img src={image.src} alt={image.alt} className="carousel-image" />
                            <div className="carousel-blur" style={{ backgroundImage: `url(${image.src})` }} />
                        </div>
                    </div>
                ))}
            </Carousel>
        </Box>
    );
};

export default HomePage;
