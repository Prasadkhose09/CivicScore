import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Home,
    History,
    Gift,
    Users,
    AlertTriangle,
    FileText,
    LogOut,
    Shield,
    ClipboardList
} from 'lucide-react';
import NotificationBell from './NotificationBell';

export default function Navbar() {
    const { user, isAuthenticated, isAdmin, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!isAuthenticated) {
        return null;
    }

    return (
        <nav className="navbar animate-fade-in">
            <Link to={isAdmin ? '/admin' : '/dashboard'} className="navbar-brand">
                <div className="navbar-logo">
                    <Shield size={24} fill="white" />
                </div>
                <span>CivicScore</span>
            </Link>

            <ul className="navbar-nav">
                {isAdmin ? (
                    // Admin Navigation
                    <>
                        <li>
                            <Link to="/admin" className="navbar-link">
                                <Home size={18} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/citizens" className="navbar-link">
                                <Users size={18} />
                                <span>Citizens</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/violations" className="navbar-link">
                                <AlertTriangle size={18} />
                                <span>Violations</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/appeals" className="navbar-link">
                                <FileText size={18} />
                                <span>Appeals</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/audit-logs" className="navbar-link">
                                <ClipboardList size={18} />
                                <span>Audit Logs</span>
                            </Link>
                        </li>
                    </>
                ) : (
                    // Citizen Navigation
                    <>
                        <li>
                            <Link to="/dashboard" className="navbar-link">
                                <Home size={18} />
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/score-history" className="navbar-link">
                                <History size={18} />
                                <span>History</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/incentives" className="navbar-link">
                                <Gift size={18} />
                                <span>Incentives</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/community" className="navbar-link">
                                <Users size={18} />
                                <span>Community</span>
                            </Link>
                        </li>
                    </>
                )}
            </ul>

            <div className="navbar-actions">
                <div className="action-box">
                    {!isAdmin && <NotificationBell />}
                    <div className="user-profile-nav">
                        <div className="user-info-text">
                            <span className="username">{user?.username}</span>
                            <span className="user-role badge badge-saffron">{user?.role}</span>
                        </div>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-ghost logout-btn" title="Sign Out">
                    <LogOut size={18} />
                </button>
            </div>

            <style>{`
                .action-box {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: var(--gray-50);
                    padding: 6px 16px;
                    border-radius: 12px;
                    border: 1px solid var(--gray-200);
                }
                .user-profile-nav {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding-left: 16px;
                    border-left: 1px solid var(--gray-300);
                }
                .user-info-text {
                    display: flex;
                    flex-direction: column;
                    text-align: left;
                }
                .username {
                    font-weight: 700;
                    font-size: 0.85rem;
                    color: var(--gray-900);
                    line-height: 1.2;
                }
                .user-role {
                    font-size: 0.65rem;
                    padding: 1px 6px;
                    width: fit-content;
                }
                .logout-btn {
                    padding: 10px;
                    color: var(--error);
                    transition: var(--transition-smooth);
                    border-radius: 12px;
                    background: white;
                    border: 1px solid var(--gray-200);
                    box-shadow: var(--shadow-sm);
                }
                .logout-btn:hover {
                    background: rgba(255, 23, 68, 0.05);
                    color: var(--error);
                    border-color: var(--error);
                    transform: translateY(-1px);
                }
                @media (max-width: 992px) {
                    .navbar-link span { display: none; }
                    .username { display: none; }
                }
            `}</style>
        </nav>
    );
}
