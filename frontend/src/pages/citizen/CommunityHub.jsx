import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { challengesAPI } from '../../services/api';
import { Users, Leaf, Heart, BookOpen, Target, CheckCircle, Loader, AlertCircle, ArrowRight } from 'lucide-react';

export default function CommunityHub() {
    const { user } = useAuth();
    const [challenges, setChallenges] = useState([]);
    const [myParticipations, setMyParticipations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.citizenId) {
            loadData();
        }
    }, [user?.citizenId]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [available, mine] = await Promise.all([
                challengesAPI.getAvailable(),
                challengesAPI.getMy(user.citizenId)
            ]);
            setChallenges(available);
            setMyParticipations(mine);
        } catch (err) {
            setError('Failed to load community data');
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (challengeId) => {
        setActionLoading(challengeId);
        try {
            await challengesAPI.join(challengeId, user.citizenId);
            await loadData(); // Refresh data
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const handleComplete = async (challengeId) => {
        setActionLoading(challengeId);
        try {
            await challengesAPI.complete(challengeId, user.citizenId);
            await loadData(); // Refresh data
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(null);
        }
    };

    const getStatus = (challengeId) => {
        const p = myParticipations.find(p => p.challenge.id === challengeId);
        return p ? p.status : 'NOT_JOINED';
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'ENVIRONMENT': return <Leaf size={20} style={{ color: 'var(--green)' }} />;
            case 'HEALTH': return <Heart size={20} style={{ color: 'var(--error)' }} />;
            case 'COMMUNITY': return <Users size={20} style={{ color: 'var(--navy)' }} />;
            default: return <BookOpen size={20} style={{ color: 'var(--saffron)' }} />;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <Users size={32} style={{ marginRight: '12px', color: 'var(--saffron)' }} />
                    Community Hub
                </h1>
                <p className="page-subtitle">Participate in community tasks and boost your civic score</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader size={48} className="animate-spin" style={{ color: 'var(--saffron)' }} />
                </div>
            ) : error ? (
                <div className="alert alert-error">
                    <AlertCircle size={20} />
                    {error}
                </div>
            ) : (
                <div className="grid grid-3">
                    {challenges.map(challenge => {
                        const status = getStatus(challenge.id);
                        const isLoading = actionLoading === challenge.id;

                        return (
                            <div key={challenge.id} className="card challenge-card">
                                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        {getCategoryIcon(challenge.category)}
                                        <span className="badge" style={{ fontSize: '0.7rem' }}>{challenge.category}</span>
                                    </div>
                                    <div className="reward-badge">
                                        +{challenge.scoreReward} pts
                                    </div>
                                </div>
                                <div className="card-body">
                                    <h3 className="challenge-title">{challenge.title}</h3>
                                    <p className="challenge-desc">{challenge.description}</p>

                                    <div className="challenge-actions" style={{ marginTop: '20px' }}>
                                        {status === 'NOT_JOINED' ? (
                                            <button
                                                className="btn btn-primary btn-block"
                                                onClick={() => handleJoin(challenge.id)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? <Loader size={18} className="animate-spin" /> : 'Join Challenge'}
                                            </button>
                                        ) : status === 'JOINED' ? (
                                            <button
                                                className="btn btn-success btn-block"
                                                onClick={() => handleComplete(challenge.id)}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? <Loader size={18} className="animate-spin" /> : 'Mark as Completed'}
                                            </button>
                                        ) : (
                                            <div className="status-completed">
                                                <CheckCircle size={18} />
                                                Challenge Completed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                .challenge-card {
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    transition: transform 0.2s;
                }
                .challenge-card:hover {
                    transform: translateY(-4px);
                }
                .reward-badge {
                    background: var(--gradient-green);
                    color: white;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                }
                .challenge-title {
                    margin: 12px 0 8px;
                    color: var(--navy);
                }
                .challenge-desc {
                    color: var(--gray-600);
                    font-size: 0.9rem;
                    line-height: 1.5;
                    flex: 1;
                }
                .status-completed {
                    background: var(--gray-100);
                    color: var(--green);
                    padding: 10px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
}
