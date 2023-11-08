export function calculatePoints(customCriteria) {
    return customCriteria.map(criterion => {
        // Assuming max is the percentage value for 100 points
        const maxPoints = 100;
        const minPoints = (criterion.min / criterion.max) * maxPoints;

        return {
            ...criterion,
            minPoints: Math.ceil(minPoints),
            maxPoints: maxPoints
        };
    });
}

export const calculateResults = (scores) => {
    const results = Object.keys(scores).map(contestantId => {
        const totalScore = Object.values(scores[contestantId]).reduce((a, b) => Number(a) + Number(b), 0); // Ensure scores are numbers before adding
        const avgScore = (totalScore / (Object.keys(scores[contestantId]).length * 100)) * 100;
        return {
            contestantId,
            avgScore,
            totalScore
        };
    });

    // Rank contestants
    results.sort((a, b) => b.avgScore - a.avgScore);
    results.forEach((res, idx) => (res.rank = idx + 1));

    return results;
};