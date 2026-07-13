import { useState } from 'react';
import { citizensAPI } from '../../services/api';
import { Users, Search, Award, AlertCircle, CheckCircle } from 'lucide-react';

export default function CitizenManagement() {
    const [searchId, setSearchId] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [searchResult, setSearchResult] = useState(null);

    const handleSearchScore = async (e) => {
        e.preventDefault();
        const trimmedId = searchId.trim();
        if (!trimmedId) return;

        // UUID Format Validation (8-4-4-4-12)
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(trimmedId)) {
            setMessage({ type: 'error', text: 'Invalid Citizen ID format. Please enter a valid UUID.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });
        setSearchResult(null);

        try {
            const score = await citizensAPI.getScore(trimmedId);
            setSearchResult({ id: trimmedId, score });
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Citizen not found or invalid ID';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <Users size={32} style={{ marginRight: '12px', color: 'var(--saffron)' }} />
                    Citizen Lookup
                </h1>
                <p className="page-subtitle">Search for citizens and view their civic scores</p>
            </div>

            {/* Message Display */}
            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '24px' }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Lookup Form */}
            <div className="card card-tricolor" style={{ maxWidth: '600px', margin: '0 auto 24px' }}>
                <div className="card-header">
                    <h3 className="card-title">
                        <Search size={20} style={{ marginRight: '8px', color: 'var(--navy)' }} />
                        Lookup Citizen Score
                    </h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSearchScore}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="citizenId">Citizen ID (UUID)</label>
                            <input
                                id="citizenId"
                                type="text"
                                className="form-input"
                                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                                value={searchId}
                                onChange={(e) => setSearchId(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-navy btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Searching...' : 'Search Score'}
                        </button>
                    </form>
                </div>
            </div>

            {/* Results Panel */}
            {searchResult && (
                <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                    <div className="card-header">
                        <h3 className="card-title">
                            <Award size={20} style={{ marginRight: '8px', color: 'var(--saffron)' }} />
                            Result
                        </h3>
                    </div>
                    <div className="card-body">
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '24px' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                background: 'var(--gradient-card)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px',
                                border: '4px solid var(--saffron)'
                            }}>
                                <span style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--gray-900)' }}>
                                    {searchResult.score}
                                </span>
                            </div>
                            <h3 style={{ marginBottom: '8px' }}>Civic Score</h3>
                            <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'left', marginTop: '16px' }}>
                                <p style={{ marginBottom: '8px' }}>
                                    <strong>Full ID:</strong>
                                    <code style={{
                                        background: 'var(--gray-200)',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        marginLeft: '8px',
                                        wordBreak: 'break-all'
                                    }}>
                                        {searchResult.id}
                                    </code>
                                </p>
                                <p>
                                    <strong>Status:</strong>
                                    {searchResult.score >= 750 ? <span className="badge badge-green">Excellent</span> :
                                        searchResult.score >= 600 ? <span className="badge badge-saffron">Good</span> :
                                            <span className="badge badge-error">Needs Improvement</span>}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {!searchResult && !loading && (
                <div className="empty-state">
                    <div className="empty-state-icon">👤</div>
                    <h3 className="empty-state-title">No Search Yet</h3>
                    <p className="empty-state-text">
                        Search for a citizen to view their score
                    </p>
                </div>
            )}
        </div>
    );
}
