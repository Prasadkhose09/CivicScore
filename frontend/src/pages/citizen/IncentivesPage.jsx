import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { incentivesAPI, citizensAPI } from '../../services/api';
import { Gift, CheckCircle, XCircle, Star, Award, Plane, CreditCard, Building2, GraduationCap, Search, Loader, AlertCircle } from 'lucide-react';

export default function IncentivesPage() {
    const location = useLocation();
    const { user } = useAuth();
    const [citizenId, setCitizenId] = useState(location.state?.citizenId || user?.citizenId || '');
    const [incentives, setIncentives] = useState([]);
    const [currentScore, setCurrentScore] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const idToLoad = location.state?.citizenId || user?.citizenId;
        if (idToLoad) {
            setCitizenId(idToLoad);
            loadIncentivesInternal(idToLoad);
        }
    }, [location.state?.citizenId, user?.citizenId]);

    const loadIncentives = async () => {
        loadIncentivesInternal(citizenId);
    };

    const loadIncentivesInternal = async (idToLoad) => {
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
            // Fetch citizen to get current score
            const citizen = await citizensAPI.getById(trimmedId);
            setCurrentScore(citizen.currentScore);

            // Fetch incentives
            const inc = await incentivesAPI.getIncentives(trimmedId);
            setIncentives(inc);
        } catch (err) {
            console.error('Fetch error:', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to load incentives. Please check the Citizen ID.';
            setError(errorMsg);
            setIncentives([]);
            setCurrentScore(null);
        } finally {
            setLoading(false);
        }
    };

    const eligibleCount = incentives.filter(i => i.eligible).length;
    const totalCount = incentives.length;

    const getIcon = (name) => {
        if (!name) return <Award size={24} />;
        if (name.includes('Passport')) return <Plane size={24} />;
        if (name.includes('Tax')) return <CreditCard size={24} />;
        if (name.includes('Loan')) return <Building2 size={24} />;
        if (name.includes('Job')) return <Star size={24} />;
        if (name.includes('Education') || name.includes('Scholarship')) return <GraduationCap size={24} />;
        return <Award size={24} />;
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <Gift size={32} style={{ marginRight: '12px', color: 'var(--green)' }} />
                    Incentives & Benefits
                </h1>
                <p className="page-subtitle">Explore the benefits you've earned through your civic contributions</p>
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
                            onClick={loadIncentives}
                            disabled={loading}
                        >
                            {loading ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
                            Load Incentives
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

            {currentScore !== null && (
                <>
                    {/* Summary Banner */}
                    <div className="dashboard-welcome" style={{ marginBottom: '32px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--green)' }}>{eligibleCount}</div>
                                <div style={{ color: 'var(--gray-600)' }}>Eligible Benefits</div>
                            </div>
                            <div style={{ width: '2px', height: '60px', background: 'var(--gray-300)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--saffron)' }}>{currentScore}</div>
                                <div style={{ color: 'var(--gray-600)' }}>Current Score</div>
                            </div>
                            <div style={{ width: '2px', height: '60px', background: 'var(--gray-300)' }}></div>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ fontSize: '3rem', fontWeight: '700', color: 'var(--navy)' }}>{totalCount}</div>
                                <div style={{ color: 'var(--gray-600)' }}>Total Benefits Available</div>
                            </div>
                        </div>
                    </div>

                    {/* Eligible Incentives */}
                    {incentives.filter(i => i.eligible).length > 0 && (
                        <>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={24} color="var(--green)" />
                                Eligible Benefits
                            </h2>
                            <div className="grid grid-2" style={{ marginBottom: '48px' }}>
                                {incentives.filter(i => i.eligible).map((item, index) => (
                                    <div
                                        key={item.id || item.incentive?.incentiveId}
                                        className="card card-green animate-slide-in"
                                        style={{ animationDelay: `${index * 100}ms` }}
                                    >
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: 'var(--radius-lg)',
                                                background: 'var(--gradient-green)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                flexShrink: 0
                                            }}>
                                                {getIcon(item.incentive?.name)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>
                                                    {item.incentive?.name}
                                                </h3>
                                                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', marginBottom: '8px' }}>
                                                    {item.incentive?.description}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className="badge badge-success">
                                                        <CheckCircle size={12} style={{ marginRight: '4px' }} />
                                                        Eligible
                                                    </span>
                                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                                                        Min. Score: {item.incentive?.minScore || 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Not Yet Eligible */}
                    {incentives.filter(i => !i.eligible).length > 0 && (
                        <>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <XCircle size={24} color="var(--gray-400)" />
                                Not Yet Eligible
                            </h2>
                            <div className="grid grid-2">
                                {incentives.filter(i => !i.eligible).map((item, index) => (
                                    <div
                                        key={item.id || item.incentive?.incentiveId}
                                        className="card animate-slide-in"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            opacity: 0.7,
                                            borderLeft: '4px solid var(--gray-300)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', gap: '16px' }}>
                                            <div style={{
                                                width: '56px',
                                                height: '56px',
                                                borderRadius: 'var(--radius-lg)',
                                                background: 'var(--gray-200)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'var(--gray-500)',
                                                flexShrink: 0
                                            }}>
                                                {getIcon(item.incentive?.name)}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px', color: 'var(--gray-600)' }}>
                                                    {item.incentive?.name}
                                                </h3>
                                                <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginBottom: '8px' }}>
                                                    {item.incentive?.description}
                                                </p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <span className="badge badge-pending">
                                                        Not Eligible
                                                    </span>
                                                    <span style={{ color: 'var(--gray-500)', fontSize: '0.75rem' }}>
                                                        Required: {item.incentive?.minScore || 'N/A'}
                                                        {item.incentive?.minScore && currentScore && (
                                                            <span style={{ color: 'var(--saffron)', fontWeight: '600', marginLeft: '4px' }}>
                                                                (Need +{item.incentive.minScore - currentScore} pts)
                                                            </span>
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}

                    {incentives.length === 0 && (
                        <div className="card">
                            <div className="card-body">
                                <div className="empty-state">
                                    <div className="empty-state-icon">🎁</div>
                                    <h3 className="empty-state-title">No Incentives Found</h3>
                                    <p className="empty-state-text">No incentive data available for this citizen</p>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            {currentScore === null && !loading && (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <div className="empty-state-icon">🎁</div>
                            <h3 className="empty-state-title">Enter Citizen ID</h3>
                            <p className="empty-state-text">Enter your Citizen ID above to view your incentives</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
