import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { dashboardAPI } from '../../services/api';
import {
    Users,
    AlertTriangle,
    FileText,
    TrendingUp,
    Shield,
    Activity,
    Clock,
    CheckCircle,
    Loader
} from 'lucide-react';

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Demo recent activities (would need activity logging system in backend)
    const recentActivities = [
        { id: 1, type: 'violation', message: 'New violation reported for Citizen #456', time: '5 mins ago' },
        { id: 2, type: 'appeal', message: 'Appeal #892 resolved - Approved', time: '12 mins ago' },
        { id: 3, type: 'citizen', message: 'New citizen registered: Rahul Sharma', time: '25 mins ago' },
        { id: 4, type: 'appeal', message: 'New appeal submitted for Violation #234', time: '1 hour ago' },
        { id: 5, type: 'violation', message: 'Violation severity updated for #567', time: '2 hours ago' },
    ];

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            const data = await dashboardAPI.getStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load dashboard stats:', error);
            // Fallback to zeros if API fails
            setStats({
                totalCitizens: 0,
                pendingAppeals: 0,
                violationsToday: 0,
                averageScore: 750
            });
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'violation': return <AlertTriangle size={16} />;
            case 'appeal': return <FileText size={16} />;
            case 'citizen': return <Users size={16} />;
            default: return <Activity size={16} />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'violation': return 'var(--error)';
            case 'appeal': return 'var(--saffron)';
            case 'citizen': return 'var(--green)';
            default: return 'var(--gray-500)';
        }
    };

    if (loading) {
        return (
            <div className="animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
                <Loader size={48} className="animate-spin" style={{ color: 'var(--saffron)' }} />
            </div>
        );
    }

    return (
        <div className="animate-fade-in">
            {/* Welcome Section */}
            <div className="hero-section">
                <div className="hero-content">
                    <div className="india-badge">
                        <Shield size={14} />
                        Admin Control Center
                    </div>
                    <h1 className="hero-title">
                        Welcome, {user?.username}!
                    </h1>
                    <p className="hero-subtitle">
                        Monitor system health, manage citizen records, and resolve community appeals from this central administrative hub.
                    </p>
                    <div className="hero-cta">
                        <Link to="/admin/citizens" className="btn btn-primary">
                            <Users size={18} />
                            Manage Citizens
                        </Link>
                        <Link to="/admin/violations" className="btn btn-navy">
                            <AlertTriangle size={18} />
                            Add Violation
                        </Link>
                        <Link to="/admin/appeals" className="btn btn-success">
                            <FileText size={18} />
                            Review Appeals
                        </Link>
                    </div>
                </div>
                <div className="hero-illustration">
                    <div className="chakra-bg"></div>
                    <Activity size={120} className="floating-shield" />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-4" style={{ marginBottom: '32px' }}>
                <div className="card stat-card card-tricolor">
                    <div className="stat-icon" style={{ background: 'var(--gradient-saffron)', color: 'white' }}>
                        <Users size={24} />
                    </div>
                    <div className="stat-value">{stats?.totalCitizens || 0}</div>
                    <div className="stat-label">Total Citizens</div>
                </div>

                <div className="card stat-card card-saffron">
                    <div className="stat-icon" style={{ background: 'var(--gradient-saffron)', color: 'white' }}>
                        <FileText size={24} />
                    </div>
                    <div className="stat-value">{stats?.pendingAppeals || 0}</div>
                    <div className="stat-label">Pending Appeals</div>
                </div>

                <div className="card stat-card" style={{ borderLeft: '4px solid var(--error)' }}>
                    <div className="stat-icon" style={{ background: 'linear-gradient(135deg, var(--error) 0%, #f87171 100%)', color: 'white' }}>
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-value">{stats?.violationsToday || 0}</div>
                    <div className="stat-label">Violations Today</div>
                </div>

                <div className="card stat-card card-green">
                    <div className="stat-icon" style={{ background: 'var(--gradient-green)', color: 'white' }}>
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-value">{Math.round(stats?.averageScore || 750)}</div>
                    <div className="stat-label">Avg. Citizen Score</div>
                </div>
            </div>

            {/* Quick Actions & Recent Activity */}
            <div className="dashboard-grid" style={{ gridTemplateColumns: '1fr 1.5fr' }}>
                {/* Quick Actions */}
                <div className="card">
                    <div className="card-header-modern">
                        <h3>Quick Actions</h3>
                        <Activity size={20} className="text-saffron-dark" />
                    </div>
                    <div className="quick-actions-list" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Link to="/admin/citizens" className="btn btn-outline-box">
                            <Users size={18} />
                            Citizen Lookup
                        </Link>
                        <Link to="/admin/violations" className="btn btn-outline-box">
                            <AlertTriangle size={18} />
                            Report New Violation
                        </Link>
                        <Link to="/admin/appeals" className="btn btn-outline-box">
                            <CheckCircle size={18} />
                            Review Pending Appeals ({stats?.pendingAppeals || 0})
                        </Link>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="card">
                    <div className="card-header-modern">
                        <h3>Recent Activity</h3>
                        <Clock size={20} className="text-gray-400" />
                    </div>
                    <div className="modern-timeline" style={{ marginTop: '20px' }}>
                        {recentActivities.map((activity, index) => (
                            <div
                                key={activity.id}
                                className="timeline-event animate-slide-in"
                                style={{ animationDelay: `${index * 50}ms`, marginBottom: '16px', borderBottom: index < recentActivities.length - 1 ? '1px solid var(--gray-100)' : 'none', paddingBottom: '16px' }}
                            >
                                <div className="event-icon-box" style={{
                                    background: `${getActivityColor(activity.type)}15`,
                                    color: getActivityColor(activity.type)
                                }}>
                                    {getActivityIcon(activity.type)}
                                </div>
                                <div className="event-info">
                                    <h4 className="event-title" style={{ fontSize: '0.9rem', fontWeight: '600', marginBottom: '4px' }}>{activity.message}</h4>
                                    <span className="event-date" style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
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
                    gap: var(--gap-standard);
                    align-items: start;
                }

                .card-header-modern {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--gray-100);
                    padding-bottom: 16px;
                }

                .card-header-modern h3 {
                    font-size: 1.1rem;
                    font-weight: 700;
                    color: var(--gray-800);
                }

                .card-accent {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 4px;
                    width: 100%;
                }
                .card-accent.saffron { background: var(--saffron); }
                .card-accent.green { background: var(--green); }
                .card-accent.navy { background: var(--navy); }
                .card-accent.error { background: var(--error); }

                .btn-outline-box {
                    background: var(--gray-50);
                    border: 1px solid var(--gray-200);
                    color: var(--gray-700);
                    justify-content: flex-start;
                    padding: 12px 16px;
                }
                .btn-outline-box:hover {
                    background: var(--white);
                    border-color: var(--saffron);
                    color: var(--saffron-dark);
                    transform: translateX(4px);
                }

                .timeline-event {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }
                .event-icon-box {
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .event-info {
                    flex: 1;
                }
            `}</style>
        </div>
    );
}
