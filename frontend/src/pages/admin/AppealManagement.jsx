import { useState, useEffect } from 'react';
import { appealsAPI } from '../../services/api';
import {
    FileText,
    CheckCircle,
    XCircle,
    Clock,
    AlertCircle,
    Gavel,
    Scale,
    Loader,
    RefreshCw
} from 'lucide-react';

export default function AppealManagement() {
    const [activeTab, setActiveTab] = useState('pending');
    const [violationId, setViolationId] = useState('');
    const [reason, setReason] = useState('');
    const [appealId, setAppealId] = useState('');
    const [status, setStatus] = useState('APPROVED');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [result, setResult] = useState(null);
    const [pendingAppeals, setPendingAppeals] = useState([]);
    const [loadingAppeals, setLoadingAppeals] = useState(true);

    useEffect(() => {
        loadPendingAppeals();
    }, []);

    const loadPendingAppeals = async () => {
        try {
            setLoadingAppeals(true);
            const appeals = await appealsAPI.getPending();
            setPendingAppeals(appeals);
        } catch (error) {
            console.error('Failed to load pending appeals:', error);
            setPendingAppeals([]);
        } finally {
            setLoadingAppeals(false);
        }
    };

    const handleRaiseAppeal = async (e) => {
        e.preventDefault();
        if (!violationId.trim() || !reason.trim()) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const appeal = await appealsAPI.raise(violationId, reason);
            setResult(appeal);
            setMessage({ type: 'success', text: 'Appeal raised successfully!' });
            setViolationId('');
            setReason('');
            // Refresh pending appeals
            loadPendingAppeals();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to raise appeal. Please check the Violation ID.' });
        } finally {
            setLoading(false);
        }
    };

    const handleResolveAppeal = async (e) => {
        e.preventDefault();
        if (!appealId.trim()) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const appeal = await appealsAPI.resolve(appealId, status);
            setResult(appeal);
            setMessage({ type: 'success', text: `Appeal ${status.toLowerCase()} successfully!` });
            setAppealId('');
            // Refresh pending appeals
            loadPendingAppeals();
        } catch (error) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to resolve appeal. Please check the Appeal ID.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <Scale size={32} style={{ marginRight: '12px', color: 'var(--navy)' }} />
                    Appeal Management
                </h1>
                <p className="page-subtitle">Manage citizen appeals and resolve disputes fairly</p>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                <button
                    className={`btn ${activeTab === 'pending' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('pending')}
                >
                    <Clock size={18} />
                    Pending ({pendingAppeals.length})
                </button>
                <button
                    className={`btn ${activeTab === 'raise' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('raise')}
                >
                    <FileText size={18} />
                    Raise Appeal
                </button>
                <button
                    className={`btn ${activeTab === 'resolve' ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => setActiveTab('resolve')}
                >
                    <Gavel size={18} />
                    Resolve Appeal
                </button>
            </div>

            {/* Message Display */}
            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '24px' }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            {activeTab === 'pending' ? (
                // Pending Appeals List
                <div className="card">
                    <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h3 className="card-title">
                            <Clock size={20} style={{ marginRight: '8px', color: 'var(--saffron)' }} />
                            Pending Appeals
                        </h3>
                        <button
                            className="btn btn-ghost btn-sm"
                            onClick={loadPendingAppeals}
                            disabled={loadingAppeals}
                        >
                            <RefreshCw size={16} className={loadingAppeals ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                    <div className="card-body">
                        {loadingAppeals ? (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
                                <Loader size={32} className="animate-spin" style={{ color: 'var(--saffron)' }} />
                            </div>
                        ) : pendingAppeals.length === 0 ? (
                            <div className="empty-state">
                                <div className="empty-state-icon">✅</div>
                                <h3 className="empty-state-title">All Clear!</h3>
                                <p className="empty-state-text">No pending appeals to review</p>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {pendingAppeals.map((appeal, index) => (
                                    <div
                                        key={appeal.appealId}
                                        className="card animate-slide-in"
                                        style={{
                                            animationDelay: `${index * 100}ms`,
                                            background: 'var(--gray-50)'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                                    <span className="badge badge-saffron">Appeal #{appeal.appealId}</span>
                                                    <span className="badge badge-pending">
                                                        <Clock size={12} style={{ marginRight: '4px' }} />
                                                        {appeal.status}
                                                    </span>
                                                </div>
                                                <h4 style={{ marginBottom: '8px' }}>{appeal.citizen?.fullName || 'Unknown Citizen'}</h4>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '8px' }}>
                                                    <strong>Violation:</strong> {appeal.violation?.description || 'N/A'}
                                                    {appeal.violation?.severity && (
                                                        <span className="badge" style={{ marginLeft: '8px', fontSize: '0.7rem' }}>
                                                            {appeal.violation.severity}
                                                        </span>
                                                    )}
                                                </p>
                                                <p style={{ fontSize: '0.875rem', color: 'var(--gray-600)', marginBottom: '8px' }}>
                                                    <strong>Reason:</strong> {appeal.reason}
                                                </p>
                                                <p style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                    Submitted: {appeal.createdAt ? new Date(appeal.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                                                </p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() => {
                                                        setAppealId(appeal.appealId.toString());
                                                        setStatus('APPROVED');
                                                        setActiveTab('resolve');
                                                    }}
                                                >
                                                    <CheckCircle size={16} />
                                                    Approve
                                                </button>
                                                <button
                                                    className="btn btn-sm"
                                                    style={{
                                                        background: 'var(--error)',
                                                        color: 'white',
                                                        border: 'none'
                                                    }}
                                                    onClick={() => {
                                                        setAppealId(appeal.appealId.toString());
                                                        setStatus('REJECTED');
                                                        setActiveTab('resolve');
                                                    }}
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="grid grid-2">
                    {/* Form */}
                    <div className="card card-tricolor">
                        {activeTab === 'raise' ? (
                            <>
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <FileText size={20} style={{ marginRight: '8px', color: 'var(--green)' }} />
                                        Raise New Appeal
                                    </h3>
                                </div>
                                <form onSubmit={handleRaiseAppeal}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="violationId">Violation ID</label>
                                        <input
                                            id="violationId"
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter violation ID number"
                                            value={violationId}
                                            onChange={(e) => setViolationId(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="reason">Appeal Reason</label>
                                        <textarea
                                            id="reason"
                                            className="form-textarea"
                                            placeholder="Explain the reason for this appeal..."
                                            value={reason}
                                            onChange={(e) => setReason(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-success btn-lg" style={{ width: '100%' }} disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Appeal'}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <div className="card-header">
                                    <h3 className="card-title">
                                        <Gavel size={20} style={{ marginRight: '8px', color: 'var(--navy)' }} />
                                        Resolve Appeal
                                    </h3>
                                </div>
                                <form onSubmit={handleResolveAppeal}>
                                    <div className="form-group">
                                        <label className="form-label" htmlFor="appealId">Appeal ID</label>
                                        <input
                                            id="appealId"
                                            type="text"
                                            className="form-input"
                                            placeholder="Enter appeal ID number"
                                            value={appealId}
                                            onChange={(e) => setAppealId(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Decision</label>
                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button
                                                type="button"
                                                onClick={() => setStatus('APPROVED')}
                                                style={{
                                                    flex: 1,
                                                    padding: '16px',
                                                    border: `2px solid ${status === 'APPROVED' ? 'var(--green)' : 'var(--gray-300)'}`,
                                                    borderRadius: 'var(--radius-md)',
                                                    background: status === 'APPROVED' ? 'rgba(19, 136, 8, 0.1)' : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                <CheckCircle size={24} color="var(--green)" />
                                                <span style={{ fontWeight: '600' }}>Approve</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                    Restores points
                                                </span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setStatus('REJECTED')}
                                                style={{
                                                    flex: 1,
                                                    padding: '16px',
                                                    border: `2px solid ${status === 'REJECTED' ? 'var(--error)' : 'var(--gray-300)'}`,
                                                    borderRadius: 'var(--radius-md)',
                                                    background: status === 'REJECTED' ? 'rgba(239, 68, 68, 0.1)' : 'white',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    gap: '8px'
                                                }}
                                            >
                                                <XCircle size={24} color="var(--error)" />
                                                <span style={{ fontWeight: '600' }}>Reject</span>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                    Keeps deduction
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                    <button type="submit" className="btn btn-navy btn-lg" style={{ width: '100%' }} disabled={loading}>
                                        {loading ? 'Processing...' : 'Submit Decision'}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>

                    {/* Result Panel */}
                    <div className="card">
                        <div className="card-header">
                            <h3 className="card-title">Result</h3>
                        </div>
                        <div className="card-body">
                            {result ? (
                                <div className="animate-fade-in" style={{ textAlign: 'center', padding: '24px' }}>
                                    <div style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '50%',
                                        background: result.status === 'APPROVED'
                                            ? 'var(--gradient-green)'
                                            : result.status === 'REJECTED'
                                                ? 'linear-gradient(135deg, var(--error) 0%, #f87171 100%)'
                                                : 'var(--gradient-saffron)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: '0 auto 16px',
                                        color: 'white'
                                    }}>
                                        {result.status === 'APPROVED' ? <CheckCircle size={40} /> :
                                            result.status === 'REJECTED' ? <XCircle size={40} /> :
                                                <Clock size={40} />}
                                    </div>
                                    <h3 style={{ marginBottom: '8px' }}>
                                        Appeal {result.status === 'PENDING' ? 'Submitted' : result.status}
                                    </h3>
                                    <p style={{ color: 'var(--gray-500)', marginBottom: '16px' }}>
                                        Appeal ID: {result.appealId}
                                    </p>
                                    <span className={`badge ${result.status === 'APPROVED' ? 'badge-success' :
                                        result.status === 'REJECTED' ? 'badge-error' : 'badge-warning'
                                        }`}>
                                        {result.status}
                                    </span>
                                </div>
                            ) : (
                                <div className="empty-state">
                                    <div className="empty-state-icon">⚖️</div>
                                    <h3 className="empty-state-title">No Activity</h3>
                                    <p className="empty-state-text">
                                        {activeTab === 'raise'
                                            ? 'Submit an appeal to see the result'
                                            : 'Resolve an appeal to see the outcome'
                                        }
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
