import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/MainPage/Navbar/Navbar';
import HomePage from './components/MainPage/HomePage/HomePage';
import AboutPage from './components/MainPage/AboutPage/AboutPage';
import TournamentBracket from './components/MainPage/EventsPage/TournamentBracket';
import AnnouncementsPage from './components/MainPage/AnnouncementsPage/AnnouncementsPage';
import AnnouncementDetails from "./components/Announcements/AnnouncementDetails";
import JudgedEventPage from "./components/JudgedEvent/JudgedEventPage";
import DashboardApp from "./components/DashboardPage/DashboardApp";
import Footer from "./components/MainPage/Footer/Footer";
import customTheme from './theme';
import EventGateway from "./components/JudgedEvent/EventGateway";

function App() {
    return (
        <ChakraProvider theme={customTheme}>
            <CSSReset />
            <Router>
                <Navbar />
                <Box minHeight="80vh">
                    <Routes>
                        <Route exact path="/" element={<HomePage/>} />
                        <Route path="/about" element={<AboutPage/>} />
                        <Route path="/tournaments" element={<TournamentBracket/>} />
                        <Route path="/announcements/*" element={<AnnouncementsPage/>} />
                        <Route path="/announcements/:id" element={<AnnouncementDetails/>} />
                        <Route path="/event/" element={<EventGateway/>} />
                        <Route path="/event/:eventName/:judgeId" element={<JudgedEventPage />} />
                        <Route path="/dashboard/*" element={<DashboardApp />} />
                    </Routes>
                </Box>
                <Footer />
            </Router>
        </ChakraProvider>

    );
}

export default App;
