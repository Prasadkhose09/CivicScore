import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import { Bell, CheckCircle, Info, TrendingUp, Loader, AlertCircle } from 'lucide-react';

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (user?.citizenId) {
            loadNotifications();
        }
    }, [user?.citizenId]);

    const loadNotifications = async () => {
        setLoading(true);
        try {
            const data = await notificationsAPI.getNotifications(user.citizenId);
            setNotifications(data);
        } catch (err) {
            setError('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SCORE_CHANGE': return <TrendingUp size={24} style={{ color: 'var(--saffron)' }} />;
            case 'APPEAL_UPDATE': return <CheckCircle size={24} style={{ color: 'var(--green)' }} />;
            default: return <Info size={24} style={{ color: 'var(--navy)' }} />;
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <Bell size={32} style={{ marginRight: '12px', color: 'var(--saffron)' }} />
                    Notifications
                </h1>
                <p className="page-subtitle">Stay updated with your civic score and appeals</p>
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
            ) : notifications.length === 0 ? (
                <div className="card">
                    <div className="card-body">
                        <div className="empty-state">
                            <Bell size={48} style={{ color: 'var(--gray-300)', marginBottom: '16px' }} />
                            <h3>No Notifications</h3>
                            <p>You're all caught up!</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="notification-page-list">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            className={`card notification-card ${!n.isRead ? 'unread' : 'read'}`}
                            onClick={() => !n.isRead && handleRead(n.id)}
                            style={{
                                marginBottom: '16px',
                                cursor: n.isRead ? 'default' : 'pointer',
                                borderLeft: !n.isRead ? '4px solid var(--saffron)' : 'auto'
                            }}
                        >
                            <div className="card-body" style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                                <div className="notification-icon-bg" style={{
                                    width: '48px',
                                    height: '48px',
                                    borderRadius: '12px',
                                    background: 'var(--gray-50)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {getIcon(n.type)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--navy)' }}>{n.title}</h3>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--gray-400)' }}>
                                            {new Date(n.createdAt).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <p style={{ margin: 0, color: 'var(--gray-600)' }}>{n.message}</p>
                                </div>
                                {!n.isRead && <div className="unread-indicator" style={{
                                    width: '12px',
                                    height: '12px',
                                    background: 'var(--saffron)',
                                    borderRadius: '50%'
                                }}></div>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                .notification-card {
                    transition: all 0.2s ease;
                }
                .notification-card.unread {
                    background: #fdf2f2;
                }
                .notification-card:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }
            `}</style>
        </div>
    );
}
