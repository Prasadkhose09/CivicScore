import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function ScoreChart({ data }) {
    // If no data, show empty state or placeholder
    if (!data || data.length === 0) {
        return (
            <div style={{
                height: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--gray-50)',
                borderRadius: '12px',
                color: 'var(--gray-400)'
            }}>
                No history data available for visualization
            </div>
        );
    }

    // Sort data by date ascending for the chart
    const sortedData = [...data].sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));

    // Format data for Recharts
    const chartData = sortedData.map(item => ({
        date: new Date(item.changedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
        score: item.scoreAfter,
        fullDate: new Date(item.changedAt).toLocaleDateString('en-IN'),
        reason: item.reason
    }));

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    background: 'white',
                    padding: '12px',
                    border: '1px solid var(--gray-200)',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-lg)'
                }}>
                    <p style={{ fontWeight: 'bold', margin: 0, color: 'var(--navy)' }}>{payload[0].value} Points</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)', margin: '4px 0' }}>{payload[0].payload.fullDate}</p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--gray-700)', margin: 0 }}>{payload[0].payload.reason}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--saffron)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--saffron)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--gray-200)" />
                    <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--gray-500)', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        domain={[0, 900]}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'var(--gray-500)', fontSize: 12 }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="score"
                        stroke="var(--saffron)"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#colorScore)"
                        animationDuration={1500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
