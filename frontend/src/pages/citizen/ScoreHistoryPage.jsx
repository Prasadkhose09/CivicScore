import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { scoreHistoryAPI } from '../../services/api';
import { TrendingUp, TrendingDown, History as HistoryIcon, Calendar, Search, Loader, AlertCircle } from 'lucide-react';
import ScoreChart from '../../components/common/ScoreChart';

export default function ScoreHistoryPage() {
    const location = useLocation();
    const { user } = useAuth();
    const [citizenId, setCitizenId] = useState(location.state?.citizenId || user?.citizenId || '');
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const idToLoad = location.state?.citizenId || user?.citizenId;
        if (idToLoad) {
            setCitizenId(idToLoad);
            loadHistoryInternal(idToLoad);
        }
    }, [location.state?.citizenId, user?.citizenId]);

    const loadHistory = async () => {
        loadHistoryInternal(citizenId);
    };

    const loadHistoryInternal = async (idToLoad) => {
        const trimmedId = idToLoad.trim();
        if (!trimmedId) {
            setError('Please enter a Citizen ID');
            return;
        }

        // UUID Format Validation (8-4-4-4-12)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedId)) {
            setError('Invalid Citizen ID format. Please enter a valid UUID.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const data = await scoreHistoryAPI.getHistory(trimmedId);
            setHistory(data);
        } catch (err) {
            console.error('Fetch error:', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to load score history. Please check the Citizen ID.';
            setError(errorMsg);
            setHistory([]);
        } finally {
            setLoading(false);
        }
    };

    const totalChanges = history.length;
    const positiveChanges = history.filter(h => h.scoreAfter > h.scoreBefore).length;
    const negativeChanges = history.filter(h => h.scoreAfter < h.scoreBefore).length;

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <HistoryIcon size={32} style={{ marginRight: '12px', color: 'var(--saffron)' }} />
                    Score History
                </h1>
                <p className="page-subtitle">Track all changes to your civic score over time</p>
            </div>

            {/* Citizen ID Input */}
            <div className="card card-tricolor" style={{ marginBottom: '24px' }}>
                <div className="card-body">
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                            <label className="form-label" htmlFor="citizenId">Citizen ID (UUID)</label>
                            <input
                                id="citizenId"
                                type="text"
                                className="form-input"
                                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                                value={citizenId}
                                onChange={(e) => setCitizenId(e.target.value)}
                            />
                        </div>
                        <button
                            className="btn btn-primary btn-lg"
                            onClick={loadHistory}
                            disabled={loading}
                        >
                            {loading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
                            Load History
                        </button>
                    </div>
                    {error && (
                        <div className="alert alert-error" style={{ marginTop: '16px' }}>
                            <AlertCircle size={20} />
                            {error}
                        </div>
                    )}
                </div>
            </div>

            {history.length > 0 && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-3" style={{ marginBottom: '32px' }}>
                        <div className="card stat-card card-tricolor">
                            <div className="stat-icon" style={{ background: 'var(--gradient-navy)', color: 'white' }}>
                                <Calendar size={24} />
                            </div>
                            <div className="stat-value">{totalChanges}</div>
                            <div className="stat-label">Total Changes</div>
                        </div>
                        <div className="card stat-card card-green">
                            <div className="stat-icon" style={{ background: 'var(--gradient-green)', color: 'white' }}>
                                <TrendingUp size={24} />
                            </div>
                            <div className="stat-value">{positiveChanges}</div>
                            <div className="stat-label">Positive Changes</div>
                        </div>
                        <div className="card stat-card" style={{ borderLeft: '4px solid var(--error)' }}>
                            <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--error) 0%, #f87171 100%)', color: 'white' }}>
                                <TrendingDown size={24} />
                            </div>
                            <div className="stat-value">{negativeChanges}</div>
                            <div className="stat-label">Negative Changes</div>
                        </div>
                    </div>

                    {/* Score Chart */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-header">
                            <h3 className="card-title">Score Trend Visualization</h3>
                        </div>
                        <div className="card-body">
                            <ScoreChart data={history} />
                        </div>
                    </div>

                    {/* History Timeline */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Complete History</h3>
                        </div>
                        <div className="card-body">
                            <div className="timeline">
                                {history.map((item, index) => {
                                    const change = item.scoreAfter - item.scoreBefore;
                                    const isPositive = change >= 0;
                                    return (
                                        <div
                                            key={item.id || index}
                                            className="timeline-item animate-slide-in"
                                            style={{ animationDelay: `${index * 50}ms` }}
                                        >
                                            <div className={`timeline-dot ${isPositive ? 'positive' : 'negative'}`}></div>
                                            <div className="timeline-content">
                                                <div className="timeline-date">
                                                    {new Date(item.changedAt).toLocaleDateString('en-IN', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </div>
                                                <div className="timeline-title">{item.reason}</div>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
                                                    <div className={`timeline-score ${isPositive ? 'positive' : 'negative'}`}>
                                                        {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                                        <span style={{ marginLeft: '4px', fontWeight: '600' }}>
                                                            {isPositive ? '+' : ''}{change} points
                                                        </span>
                                                    </div>
                                                    <span className="badge badge-pending">
                                                        {item.scoreBefore} → {item.scoreAfter}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {history.length === 0 && !loading && (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">📊</div>
                            <h3 className="empty-state-title">{citizenId ? 'No History Found' : 'Enter Citizen ID'}</h3>
                            <p className="empty-state-text">
                                {citizenId ? 'No score history available for this citizen' : 'Enter your Citizen ID above to view your score history'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
