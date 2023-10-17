import { Link } from "react-router-dom";
import { HiExternalLink } from "react-icons/hi";

import JudgesSection from './JudgesSection';
import ContestantsSection from './ContestantsSection';

const PageantPage = () => {
    return (
        <div>
            <Link to='score' isExternal>
                Scores <HiExternalLink mx='2px' />
            </Link>

            <JudgesSection />

            <ContestantsSection />
        </div>
    );
};

export default PageantPage;
