import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ScoreGauge from '../../components/common/ScoreGauge';
import { citizensAPI, scoreHistoryAPI, incentivesAPI } from '../../services/api';
import {
    History as HistoryIcon,
    Gift,
    TrendingUp,
    TrendingDown,
    Award,
    Target,
    Sparkles,
    Search,
    Loader,
    AlertCircle,
    Users,
    Clock,
    Shield
} from 'lucide-react';
import ScoreChart from '../../components/common/ScoreChart';

export default function CitizenDashboard() {
    const { user } = useAuth();
    const [citizenId, setCitizenId] = useState(user?.citizenId || '');
    const [citizenData, setCitizenData] = useState(null);
    const [score, setScore] = useState(null);
    const [recentHistory, setRecentHistory] = useState([]);
    const [incentives, setIncentives] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.citizenId) {
            setCitizenId(user.citizenId);
            loadCitizenDataInternal(user.citizenId);
        }
    }, [user?.citizenId]);

    const loadCitizenData = async () => {
        loadCitizenDataInternal(citizenId);
    };

    const loadCitizenDataInternal = async (idToLoad) => {
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
            // Fetch citizen profile
            const citizen = await citizensAPI.getById(trimmedId);
            setCitizenData(citizen);
            setScore(citizen.currentScore);

            // Fetch score history
            try {
                const history = await scoreHistoryAPI.getHistory(trimmedId);
                setRecentHistory(history.slice(0, 5)); // Get last 5 entries
            } catch (e) {
                setRecentHistory([]);
            }

            // Fetch incentives
            try {
                const inc = await incentivesAPI.getIncentives(trimmedId);
                setIncentives(inc);
            } catch (e) {
                setIncentives([]);
            }
        } catch (err) {
            console.error('Fetch error:', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Citizen not found. Please check the ID.';
            setError(errorMsg);
            setCitizenData(null);
            setScore(null);
            setRecentHistory([]);
            setIncentives([]);
        } finally {
            setLoading(false);
        }
    };

    const getScoreStatus = () => {
        if (!score) return { text: 'Unknown', color: 'var(--gray-500)' };
        if (score >= 750) return { text: 'Excellent', color: 'var(--green)' };
        if (score >= 600) return { text: 'Good', color: 'var(--saffron)' };
        if (score >= 400) return { text: 'Fair', color: 'var(--warning)' };
        return { text: 'Poor', color: 'var(--error)' };
    };

    const status = getScoreStatus();

    return (
        <div className="dashboard-wrapper animate-fade-in">
            {/* Hero Welcome Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="india-badge">
                        <Sparkles size={16} className="sparkle-icon" />
                        <span>Developed India 2047 Mission</span>
                    </div>
                    <h1 className="hero-title">
                        Jai Hind, <span className="text-saffron-dark">{user?.username}</span>!
                    </h1>
                    <p className="hero-subtitle">
                        Your civic contribution is shaping the future of our nation. Keep it up!
                    </p>
                    <div className="hero-cta">
                        <Link to="/score-history" className="btn btn-primary shadow-premium" state={{ citizenId }}>
                            <HistoryIcon size={18} />
                            Track Progress
                        </Link>
                        <Link to="/community" className="btn btn-ghost" style={{ backgroundColor: 'rgba(255,255,255,0.8)', border: '1px solid var(--gray-200)' }}>
                            <Users size={18} />
                            Community
                        </Link>
                    </div>
                </div>
                <div className="hero-illustration">
                    <div className="chakra-bg"></div>
                    <Shield size={120} className="floating-shield" />
                </div>
            </div>

            {/* Lookup Section - Semi-collapsed if data exists */}
            {(!citizenData || (user?.role === 'ADMIN')) && (
                <div className="card lookup-card animate-slide-in">
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div className="lookup-icon">
                            <Search size={24} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '4px' }}>
                                {user?.role === 'ADMIN' ? 'Citizen Lookup' : 'Sync Your Account'}
                            </h3>
                            <div className="lookup-form">
                                <input
                                    type="text"
                                    className="form-input lookup-input"
                                    placeholder="Enter Citizen UUID..."
                                    value={citizenId}
                                    onChange={(e) => setCitizenId(e.target.value)}
                                />
                                <button
                                    className="btn btn-success lookup-btn"
                                    onClick={loadCitizenData}
                                    disabled={loading}
                                >
                                    {loading ? <Loader size={18} className="animate-spin" /> : 'Fetch Data'}
                                </button>
                            </div>
                        </div>
                    </div>
                    {error && (
                        <div className="alert alert-error" style={{ marginTop: '16px' }}>
                            <AlertCircle size={18} />
                            {error}
                        </div>
                    )}
                </div>
            )}

            {citizenData ? (
                <div className="dashboard-grid">
                    {/* Left Column: Score and Stats */}
                    <div className="stats-column">
                        <div className="card score-main-card">
                            <div className="card-header-modern">
                                <h3>Your Civic Identity</h3>
                                <span className={`status-pill ${status.text.toLowerCase()}`}>{status.text}</span>
                            </div>
                            <div className="score-display-container">
                                <ScoreGauge score={score || 0} />
                            </div>
                            <div className="citizen-info-footer">
                                <div className="info-item">
                                    <span className="info-label">Full Name</span>
                                    <span className="info-value">{citizenData.fullName}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Identity Level</span>
                                    <span className="info-value">Verified Citizen</span>
                                </div>
                            </div>
                        </div>

                        <div className="mini-stats-grid">
                            <div className="card mini-stat green-theme">
                                <div className="stat-icon-circle">
                                    <Award size={20} />
                                </div>
                                <div className="stat-data">
                                    <span className="stat-num">{incentives.filter(i => i.eligible).length}</span>
                                    <span className="stat-desc">Active Benefits</span>
                                </div>
                            </div>
                            <div className="card mini-stat saffron-theme">
                                <div className="stat-icon-circle">
                                    <Target size={20} />
                                </div>
                                <div className="stat-data">
                                    <span className="stat-num">850</span>
                                    <span className="stat-desc">Target Score</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column: Trends and Benefits */}
                    <div className="content-column" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--gap-standard)' }}>
                        <div className="card trend-card">
                            <div className="card-header-modern">
                                <h3>Score Trajectory</h3>
                                <TrendingUp size={20} className="text-saffron-dark" />
                            </div>
                            <div className="chart-container-modern">
                                <ScoreChart data={recentHistory} />
                            </div>
                        </div>

                        <div className="card benefits-preview-card">
                            <div className="card-header-modern">
                                <h3>Exclusive Benefits</h3>
                                <Link to="/incentives" state={{ citizenId }} className="text-link">Explore All</Link>
                            </div>
                            <div className="benefits-list">
                                {incentives.filter(i => i.eligible).length === 0 ? (
                                    <div className="empty-benefits">
                                        <Gift size={32} className="opacity-30" />
                                        <p>Maintain a high score to unlock rewards</p>
                                    </div>
                                ) : (
                                    incentives.filter(i => i.eligible).slice(0, 2).map((item) => (
                                        <div key={item.id} className="benefit-item">
                                            <div className="benefit-icon-box">
                                                <Sparkles size={16} />
                                            </div>
                                            <div className="benefit-text">
                                                <h4>{item.incentive?.name}</h4>
                                                <p>{item.incentive?.description}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Recent Activity */}
                    <div className="activity-column">
                        <div className="card history-sidebar">
                            <div className="card-header-modern">
                                <h3>Recent Activity</h3>
                                <Clock size={18} className="text-gray-400" />
                            </div>
                            <div className="modern-timeline">
                                {recentHistory.length === 0 ? (
                                    <p className="no-data-text">No recent changes recorded.</p>
                                ) : (
                                    recentHistory.slice(0, 4).map((item, index) => {
                                        const change = item.scoreAfter - item.scoreBefore;
                                        const isPos = change >= 0;
                                        return (
                                            <div key={item.id} className="timeline-event animate-slide-in" style={{ animationDelay: `${index * 100}ms` }}>
                                                <div className={`event-marker ${isPos ? 'pos' : 'neg'}`}></div>
                                                <div className="event-info">
                                                    <span className="event-date">{new Date(item.changedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>
                                                    <h4 className="event-title">{item.reason}</h4>
                                                    <span className={`event-change ${isPos ? 'pos' : 'neg'}`}>
                                                        {isPos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                                                        {isPos ? '+' : ''}{change}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                            <Link to="/score-history" state={{ citizenId }} className="btn btn-ghost btn-full-width">
                                Complete History
                            </Link>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="card empty-dashboard-card animate-fade-in">
                    <div className="empty-state-visual">
                        <div className="chakra-animated"></div>
                    </div>
                    <h2>Welcome to the Citizen Portal</h2>
                    <p>Enter your unique Citizen ID to access your civic profile, track your score, and unlock rewards for being a responsible citizen.</p>
                </div>
            )}

            <style>{`
                .dashboard-wrapper {
                    width: 100%;
                    padding: 0 20px;
                }
                .hero-section {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    background: var(--white);
                    border-radius: var(--radius-lg);
                    padding: 40px;
                    margin-bottom: var(--gap-standard);
                    border: 1px solid var(--gray-200);
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--shadow-md);
                }
                .hero-section::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    right: 0;
                    width: 6px;
                    height: 100%;
                    background: var(--gradient-tricolor);
                }
                .india-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: var(--saffron-glass);
                    color: var(--saffron-dark);
                    padding: 6px 14px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    margin-bottom: 20px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .hero-title {
                    font-size: 2.5rem;
                    font-weight: 800;
                    letter-spacing: -0.5px;
                    margin-bottom: 12px;
                    line-height: 1.2;
                    color: var(--gray-900);
                }
                .hero-subtitle {
                    font-size: 1.1rem;
                    color: var(--gray-600);
                    margin-bottom: 32px;
                    max-width: 500px;
                    line-height: 1.6;
                }
                .hero-cta { display: flex; gap: 16px; }
                .hero-illustration {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .chakra-bg {
                    position: absolute;
                    width: 220px;
                    height: 220px;
                    background: var(--chakra-glass);
                    border-radius: 50%;
                    filter: blur(50px);
                }
                .floating-shield {
                    color: var(--navy);
                    filter: drop-shadow(0 15px 30px rgba(0,0,128,0.15));
                    animation: float 4s ease-in-out infinite;
                }
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-12px); }
                }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: 360px 1fr 320px;
                    gap: var(--gap-standard);
                    align-items: start;
                }
                .card-header-modern {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                    border-bottom: 1px solid var(--gray-100);
                    padding-bottom: 16px;
                }
                .card-header-modern h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--gray-800);
                }
                .status-pill {
                    padding: 4px 12px;
                    border-radius: 100px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-transform: uppercase;
                }
                .status-pill.excellent { background: var(--green-glass); color: var(--green-dark); }
                .status-pill.good { background: var(--saffron-glass); color: var(--saffron-dark); }

                .score-display-container {
                    position: relative;
                    padding: 20px 0;
                    display: flex;
                    justify-content: center;
                }
                .score-label-overlay {
                    position: absolute;
                    top: 55%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    text-align: center;
                }
                .score-number {
                    font-size: 3rem;
                    font-weight: 800;
                    color: var(--navy);
                    line-height: 1;
                }
                .score-caption {
                    font-size: 0.8rem;
                    color: var(--gray-500);
                    margin-top: 4px;
                }

                .citizen-info-footer {
                    margin-top: 24px;
                    padding-top: 24px;
                    border-top: 1px solid var(--gray-100);
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                }
                .info-label { font-size: 0.75rem; color: var(--gray-500); display: block; }
                .info-value { font-weight: 700; font-size: 0.95rem; color: var(--gray-800); }

                .mini-stats-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                    margin-top: 25px;
                }
                .mini-stat {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    padding: 20px;
                }
                .stat-icon-circle {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .green-theme .stat-icon-circle { background: var(--green); color: white; }
                .saffron-theme .stat-icon-circle { background: var(--saffron); color: white; }
                .stat-num { font-size: 1.5rem; font-weight: 700; display: block; line-height: 1; }
                .stat-desc { font-size: 0.75rem; color: var(--gray-500); }

                .benefit-item {
                    display: flex;
                    gap: 16px;
                    padding: 16px;
                    border-radius: 14px;
                    background: rgba(0,0,0,0.02);
                    margin-bottom: 12px;
                    transition: var(--transition-smooth);
                    border: 1px solid transparent;
                }
                .benefit-item:hover {
                    background: white;
                    border-color: var(--green-light);
                    transform: translateX(5px);
                }
                .benefit-icon-box {
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    background: var(--green-glass);
                    color: var(--green-dark);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .benefit-text h4 { font-size: 0.95rem; font-weight: 700; margin-bottom: 2px; }
                .benefit-text p { font-size: 0.8rem; color: var(--gray-500); }

                .modern-timeline { display: flex; flex-direction: column; gap: 20px; }
                .timeline-event { display: flex; gap: 16px; position: relative; }
                .timeline-event::before {
                    content: '';
                    position: absolute;
                    left: 7.5px;
                    top: 20px;
                    bottom: -15px;
                    width: 1px;
                    background: var(--gray-200);
                }
                .timeline-event:last-child::before { display: none; }
                .event-marker {
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 0 0 1px var(--gray-200);
                    background: var(--gray-300);
                    flex-shrink: 0;
                    margin-top: 4px;
                    z-index: 1;
                }
                .event-marker.pos { background: var(--success); }
                .event-marker.neg { background: var(--error); }
                .event-date { font-size: 0.7rem; color: var(--gray-400); font-weight: 600; text-transform: uppercase; }
                .event-title { font-size: 0.9rem; font-weight: 600; margin: 2px 0; }
                .event-change { font-size: 0.8rem; font-weight: 700; display: flex; align-items: center; gap: 4px; }
                .event-change.pos { color: var(--success); }
                .event-change.neg { color: var(--error); }

                @media (max-width: 1200px) {
                    .dashboard-grid { grid-template-columns: 1fr 1fr; }
                    .activity-column { grid-column: span 2; }
                }
                @media (max-width: 768px) {
                    .hero-section { grid-template-columns: 1fr; text-align: center; }
                    .hero-illustration { display: none; }
                    .hero-cta { justify-content: center; }
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .activity-column { grid-column: span 1; }
                }
            `}</style>
        </div>
    );
}
