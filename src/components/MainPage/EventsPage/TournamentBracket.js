import React, {useEffect, useState} from 'react';
import { SingleEliminationBracket, DoubleEliminationBracket, Match, MATCH_STATES, SVGViewer } from '@g-loot/react-tournament-brackets';

const TournamentBracket = () => {
    const [bracketData, setBracketData] = useState([]);

    // Assume fetchData is a function that fetches your data from the server
    const fetchData = async () => {
        const response = await fetch('http://localhost:8000/v1/matches/2');
        return await response.json();

    };

    const processMatchesData = (matchesData) => {
        return matchesData.map(match => ({
            id: match.id,
            name: `Match ${match.id}`,
            nextMatchId: null,  // You will need logic to determine the next match ID
            nextLooserMatchId: null,  // You will need logic to determine the next loser match ID
            startTime: match.match_date_time.split(' ')[0],
            state: null,
            participants: [
                {
                    id: match.team1_id.toString(),
                    resultText: match.winning_team_id === match.team1_id ? "WON" : "LOST",
                    isWinner: match.winning_team_id === match.team1_id,
                    status: null,  // You might want to map match_status to this field
                    name: `Team ${match.team1_id}`
                },
                {
                    id: match.team2_id.toString(),
                    resultText: match.winning_team_id === match.team2_id ? "WON" : "LOST",
                    isWinner: match.winning_team_id === match.team2_id,
                    status: null,  // You might want to map match_status to this fiel
                    name: `Team ${match.team2_id}`
                }
            ]
        }));
    };


    useEffect(() => {
        fetchData()
            .then(data => {
                const processedData = processMatchesData(data);
                setBracketData(processedData);
                console.log(bracketData);
            });
    }, []);


    return (
        bracketData.length > 0 ? (
            <SingleEliminationBracket
                matches={bracketData}
                matchComponent={Match}
                svgWrapper={({ children, ...props }) => (
                    <SVGViewer width={500} height={500} {...props}>
                        {children}
                    </SVGViewer>
                )}
            />
        ) : (
            <div>Loading...</div>
        )
    );
};

export default TournamentBracket;
