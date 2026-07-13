import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(username, password);

            if (result.success) {
                const from = location.state?.from?.pathname;
                if (result.role === 'ADMIN') {
                    navigate(from || '/admin', { replace: true });
                } else {
                    navigate(from || '/dashboard', { replace: true });
                }
            } else {
                setError(result.error || 'Invalid credentials. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const fillDemoCredentials = (type) => {
        if (type === 'admin') {
            setUsername('admin');
            setPassword('admin123');
        } else {
            setUsername('citizen');
            setPassword('citizen123');
        }
    };

    return (
        <div className="auth-page-wrapper">
            <div className="mesh-background"></div>
            <div className="auth-container">
                <div className="auth-card animate-fade-in">
                    <div className="auth-logo">
                        <div className="auth-logo-icon">
                            <Shield size={32} fill="white" />
                        </div>
                        <h1 className="auth-title">CivicScore</h1>
                        <p className="auth-subtitle">Developed India 2047 Mission</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        {error && (
                            <div className="alert alert-error animate-fade-in" style={{ marginBottom: '20px' }}>
                                {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label className="form-label" htmlFor="username">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="form-input"
                                placeholder="Enter your username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="form-group">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label className="form-label" htmlFor="password" style={{ marginBottom: 0 }}>
                                    Password
                                </label>
                                <a href="#" style={{ fontSize: '0.8rem', color: 'var(--saffron-dark)', fontWeight: '500' }}>Forgot?</a>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    className="form-input"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    style={{ paddingRight: '48px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="password-toggle-btn"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : (
                                <span>Sign In</span>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <div className="demo-credentials">
                            <p style={{ marginBottom: '12px' }}><strong>Quick Access:</strong></p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    type="button"
                                    onClick={() => fillDemoCredentials('admin')}
                                    className="btn btn-ghost btn-sm demo-btn"
                                >
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    onClick={() => fillDemoCredentials('citizen')}
                                    className="btn btn-ghost btn-sm demo-btn-green"
                                >
                                    Citizen
                                </button>
                            </div>
                        </div>
                        <div className="register-link-container">
                            <p>
                                Don't have an account? <Link to="/register" className="register-link">Create one</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                .auth-page-wrapper {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    background: #fdfdfd;
                }
                .mesh-background {
                    position: absolute;
                    inset: 0;
                    background: var(--gradient-mesh);
                    filter: blur(60px);
                    opacity: 0.8;
                    z-index: 0;
                    transform: scale(1.2);
                }
                .auth-container {
                    position: relative;
                    z-index: 1;
                    width: 100%;
                    max-width: 440px;
                    padding: 24px;
                }
                .auth-card {
                    padding: 56px 48px;
                    background: rgba(255, 255, 255, 0.95);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
                    backdrop-filter: blur(10px);
                }
                .auth-logo-icon {
                    width: 72px;
                    height: 72px;
                    background: var(--gradient-saffron);
                    border-radius: 20px;
                    margin: 0 auto 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 20px rgba(255, 153, 51, 0.2);
                }
                .auth-title {
                    font-size: 2rem;
                    letter-spacing: -0.5px;
                }
                .password-toggle-btn {
                    position: absolute;
                    right: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--gray-400);
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition-fast);
                }
                .password-toggle-btn:hover {
                    color: var(--saffron);
                }
                .login-submit-btn {
                    width: 100%;
                    margin-top: 16px;
                    height: 52px;
                    font-size: 1.1rem;
                    border-radius: 14px;
                }
                .demo-credentials {
                    background: rgba(0, 0, 0, 0.02);
                    padding: 20px;
                    border-radius: 16px;
                    margin-bottom: 28px;
                    border: 1px solid rgba(0, 0, 0, 0.03);
                }
                .demo-btn, .demo-btn-green {
                    flex: 1;
                    background: white;
                    border: 1px solid var(--gray-200);
                    height: 48px;
                    justify-content: center;
                    border-radius: 12px;
                    font-weight: 600;
                }
                .demo-btn:hover {
                    border-color: var(--saffron);
                    background: var(--saffron-glass);
                    color: var(--saffron-dark);
                }
                .demo-btn-green:hover {
                    border-color: var(--green);
                    background: var(--green-glass);
                    color: var(--green-dark);
                }
                .register-link-container {
                    text-align: center;
                    font-size: 0.95rem;
                    color: var(--gray-600);
                }
                .register-link {
                    color: var(--navy);
                    font-weight: 700;
                    margin-left: 4px;
                }
                .auth-card::after {
                    content: 'IN';
                    position: absolute;
                    bottom: 24px;
                    right: 24px;
                    font-size: 0.9rem;
                    font-weight: 800;
                    color: var(--navy);
                    opacity: 0.1;
                }
            `}</style>
        </div>
    );
}
