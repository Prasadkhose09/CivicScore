import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/api';
import {
    User,
    Mail,
    Lock,
    UserPlus,
    ArrowRight,
    AlertCircle,
    CheckCircle,
    Loader
} from 'lucide-react';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await authAPI.register(formData.name, formData.email, formData.password);
            setSuccess(true);
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="auth-page-wrapper">
                <div className="mesh-background"></div>
                <div className="auth-container">
                    <div className="auth-card animate-fade-in" style={{ textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '24px',
                            background: 'var(--gradient-green)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 24px',
                            color: 'white',
                            boxShadow: '0 8px 32px rgba(19, 136, 8, 0.2)'
                        }}>
                            <CheckCircle size={48} />
                        </div>
                        <h2 style={{ marginBottom: '16px', fontWeight: '800' }}>Jai Hind!</h2>
                        <h3 style={{ marginBottom: '12px' }}>Registration Successful</h3>
                        <p style={{ color: 'var(--gray-600)', marginBottom: '32px' }}>
                            Your journey towards a better India has begun. Redirecting you to login...
                        </p>
                        <div className="loader-bar" style={{ height: '6px', background: 'var(--gray-100)', borderRadius: '10px', overflow: 'hidden' }}>
                            <div className="loader-progress" style={{ width: '100%', height: '100%', background: 'var(--gradient-green)', animation: 'progress 3s linear' }}></div>
                        </div>
                    </div>
                </div>
                <style>{`
                    @keyframes progress {
                        from { width: 0; }
                        to { width: 100%; }
                    }
                    .auth-page-wrapper {
                        min-height: 100vh;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        overflow: hidden;
                        background: var(--gray-50);
                    }
                    .mesh-background {
                        position: absolute;
                        inset: 0;
                        background: var(--gradient-mesh);
                        filter: blur(80px);
                        opacity: 0.6;
                        z-index: 0;
                    }
                    .auth-container {
                        position: relative;
                        z-index: 1;
                        width: 100%;
                        max-width: 440px;
                        padding: 20px;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="auth-page-wrapper">
            <div className="mesh-background"></div>
            <div className="auth-container">
                <div className="auth-card animate-fade-in">
                    <div className="auth-logo">
                        <div className="auth-logo-icon" style={{ background: 'var(--gradient-green)' }}>
                            <UserPlus size={32} fill="white" />
                        </div>
                        <h1 className="auth-title">Join Mission 2047</h1>
                        <p className="auth-subtitle">Create your Civic Identity today</p>
                    </div>

                    {error && (
                        <div className="alert alert-error animate-fade-in" style={{ marginBottom: '20px' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                className="form-input"
                                placeholder="e.g. Rahul Sharma"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                className="form-input"
                                placeholder="name@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="form-input"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-input"
                                placeholder="Repeat your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-success register-submit-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                            ) : (
                                <>
                                    <span>Create Account</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <div className="register-link-container">
                            <p>
                                Already have an account? <Link to="/login" className="login-link">Sign In</Link>
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
                    max-width: 480px;
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
                    border-radius: 20px;
                    margin: 0 auto 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 10px 20px rgba(19, 136, 8, 0.2);
                }
                .register-submit-btn {
                    width: 100%;
                    margin-top: 16px;
                    height: 52px;
                    font-size: 1.1rem;
                    display: flex;
                    justify-content: center;
                    gap: 10px;
                    border-radius: 14px;
                }
                .register-link-container {
                    text-align: center;
                    font-size: 0.95rem;
                    color: var(--gray-600);
                    border-top: 1px solid var(--gray-100);
                    padding-top: 24px;
                    margin-top: 8px;
                }
                .login-link {
                    color: var(--saffron-dark);
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
