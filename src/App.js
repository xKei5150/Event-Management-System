import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/HomePage/HomePage';
import AboutPage from './components/AboutPage/AboutPage';
import ServicesPage from './components/ServicesPage/ServicesPage';
import EventsPage from './components/EventsPage/EventsPage';

function App() {
    return (
        <ChakraProvider>
            <CSSReset />
            <Router>
                <Navbar />
                <Box p={4}>
                    <Routes>
                        <Route exact path="/" element={<HomePage/>} />
                        <Route path="/about" element={<AboutPage/>} />
                        <Route path="/services" element={<ServicesPage/>} />
                        <Route path="/events" element={<EventsPage/>} />
                    </Routes>
                </Box>
            </Router>
        </ChakraProvider>
    );
}

export default App;
