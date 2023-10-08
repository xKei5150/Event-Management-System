import { ChakraProvider, CSSReset, Box } from '@chakra-ui/react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomePage from './components/HomePage/HomePage';
import AboutPage from './components/AboutPage/AboutPage';
import FormsPage from './components/FormsPage/FormsPage';
import EventsPage from './components/EventsPage/EventsPage';
import AddEvent from "./components/DashboardPage/Events/AddEvent";
import AnnouncementDetails from "./components/Announcements/AnnouncementDetails";
import PageantPage from "./components/PageantPage/PageantPage";
import DashboardApp from "./components/DashboardPage/DashboardApp";
import Footer from "./components/Footer/Footer";
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
                        <Route path="/events/*" element={<EventsPage/>} />
                        <Route path="/events/announcement/:id" component={AnnouncementDetails} />
                        <Route path="/pageant" element={<PageantPage />} />
                        <Route path="/dashboard/*" element={<DashboardApp />} />
                    </Routes>
                <Footer />
            </Router>
        </ChakraProvider>
    );
}

export default App;
