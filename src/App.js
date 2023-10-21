import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/MainPage/Navbar/Navbar';
import HomePage from './components/MainPage/HomePage/HomePage';
import AboutPage from './components/MainPage/AboutPage/AboutPage';
import FormsPage from './components/MainPage/FormsPage/FormsPage';
import EventsPage from './components/MainPage/EventsPage/EventsPage';
import AnnouncementDetails from "./components/Announcements/AnnouncementDetails";
import PageantPage from "./components/PageantPage/PageantPage";
import DashboardApp from "./components/DashboardPage/DashboardApp";
import Footer from "./components/MainPage/Footer/Footer";
import customTheme from './theme';

function App() {

    return (
        <ChakraProvider theme={customTheme}>
            <CSSReset />
            <Router>
                <Navbar />
                    <Routes>
                        <Route exact path="/" element={<HomePage/>} />
                        <Route path="/about" element={<AboutPage/>} />
                        <Route path="/forms" element={<FormsPage/>} />
                        <Route path="/announcements/" element={<EventsPage/>} />
                        <Route path="/announcements/:id" component={AnnouncementDetails} />
                        <Route path="/pageant" element={<PageantPage />} />
                        <Route path="/dashboard/*" element={<DashboardApp />} />
                    </Routes>
                <Footer />
            </Router>
        </ChakraProvider>
    );
}

export default App;
