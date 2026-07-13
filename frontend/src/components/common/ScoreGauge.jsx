export default function ScoreGauge({ score, maxScore = 850, size = 200 }) {
    const percentage = Math.min((score / maxScore) * 100, 100);
    const circumference = 2 * Math.PI * 85;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Determine color based on score
    let colorClass = '';
    if (score >= 700) {
        colorClass = ''; // Green (default)
    } else if (score >= 500) {
        colorClass = 'warning'; // Yellow
    } else {
        colorClass = 'danger'; // Red
    }

    return (
        <div className="score-gauge" style={{ width: size, height: size }}>
            <svg viewBox="0 0 200 200" width={size} height={size}>
                <circle
                    className="score-gauge-ring score-gauge-bg"
                    cx="100"
                    cy="100"
                    r="85"
                />
                <circle
                    className={`score-gauge-ring score-gauge-fill ${colorClass}`}
                    cx="100"
                    cy="100"
                    r="85"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                />
            </svg>
            <div className="score-gauge-value">
                <div className="score-gauge-number">{score}</div>
                <div className="score-gauge-label">/ {maxScore}</div>
            </div>
        </div>
    );
}
