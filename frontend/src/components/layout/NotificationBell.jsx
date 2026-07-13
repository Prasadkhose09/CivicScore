import { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, CheckCircle, Info, AlertTriangle, X, TrendingUp } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { notificationsAPI } from '../../services/api';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef(null);
    const stompClientRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.citizenId) {
            loadInitialData();
            setupWebSocket();
        }

        return () => {
            if (stompClientRef.current) {
                stompClientRef.current.deactivate();
            }
        };
    }, [user?.citizenId]);

    // Close dropdown on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const loadInitialData = async () => {
        try {
            const data = await notificationsAPI.getNotifications(user.citizenId);
            setNotifications(data.slice(0, 5));
            const count = await notificationsAPI.getUnreadCount(user.citizenId);
            setUnreadCount(count);
        } catch (err) {
            console.error('Failed to load notifications:', err);
        }
    };

    const setupWebSocket = () => {
        const socket = new SockJS('http://localhost:8080/ws');
        const client = new Client({
            webSocketFactory: () => socket,
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe(`/topic/notifications/${user.username}`, (message) => {
                    const newNotification = JSON.parse(message.body);
                    setNotifications(prev => [newNotification, ...prev].slice(0, 5));
                    setUnreadCount(prev => prev + 1);

                    // Show browser notification if permitted
                    if (Notification.permission === "granted") {
                        new Notification(newNotification.title, { body: newNotification.message });
                    }
                });
            },
            onStompError: (frame) => {
                console.error('STOMP error:', frame);
            }
        });

        client.activate();
        stompClientRef.current = client;
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationsAPI.markAsRead(id);
            setUnreadCount(prev => Math.max(0, prev - 1));
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SCORE_CHANGE': return <TrendingUp size={16} className="text-saffron" />;
            case 'APPEAL_UPDATE': return <CheckCircle size={16} className="text-green" />;
            default: return <Info size={16} className="text-navy" />;
        }
    };

    return (
        <div className="notification-bell-container" ref={dropdownRef}>
            <button
                className="btn btn-ghost notification-btn"
                onClick={() => setShowDropdown(!showDropdown)}
                style={{ position: 'relative', color: 'white' }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {showDropdown && (
                <div className="notification-dropdown animate-fade-in">
                    <div className="notification-header">
                        <h4>Notifications</h4>
                        <button onClick={() => navigate('/notifications')} className="btn btn-link btn-sm">View All</button>
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <BellOff size={32} />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    className={`notification-item ${n.read ? 'read' : 'unread'}`}
                                    onClick={() => handleMarkAsRead(n.id)}
                                >
                                    <div className="notification-item-content">
                                        <p className="notification-item-title">{n.title}</p>
                                        <p className="notification-item-msg">{n.message}</p>
                                        <p className="notification-item-time">
                                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                    {!n.isRead && <div className="unread-dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <style>{`
                .notification-bell-container {
                    position: relative;
                }
                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--error);
                    color: white;
                    border-radius: 50%;
                    width: 18px;
                    height: 18px;
                    font-size: 10px;
                    display: flex;
                    alignItems: center;
                    justifyContent: center;
                    border: 2px solid var(--navy);
                }
                .notification-dropdown {
                    position: absolute;
                    top: 120%;
                    right: 0;
                    width: 300px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: var(--shadow-xl);
                    z-index: 1000;
                    overflow: hidden;
                    border: 1px solid var(--gray-200);
                }
                .notification-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--gray-100);
                    display: flex;
                    justifyContent: space-between;
                    alignItems: center;
                    background: var(--gray-50);
                }
                .notification-header h4 {
                    margin: 0;
                    color: var(--navy);
                    font-size: 0.9rem;
                }
                .notification-list {
                    max-height: 400px;
                    overflow-y: auto;
                }
                .notification-item {
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--gray-100);
                    cursor: pointer;
                    display: flex;
                    alignItems: flex-start;
                    gap: 8px;
                    transition: background 0.2s;
                }
                .notification-item:hover {
                    background: var(--gray-50);
                }
                .notification-item.unread {
                    background: #fdf2f2;
                }
                .notification-item-title {
                    font-weight: 600;
                    font-size: 0.875rem;
                    margin: 0;
                    color: var(--gray-800);
                }
                .notification-item-msg {
                    font-size: 0.8rem;
                    color: var(--gray-600);
                    margin: 4px 0;
                }
                .notification-item-time {
                    font-size: 0.75rem;
                    color: var(--gray-400);
                    margin: 0;
                }
                .notification-empty {
                    padding: 32px;
                    text-align: center;
                    color: var(--gray-400);
                }
                .unread-dot {
                    width: 8px;
                    height: 8px;
                    background: var(--saffron);
                    border-radius: 50%;
                    margin-top: 6px;
                }
            `}</style>
        </div>
    );
}
