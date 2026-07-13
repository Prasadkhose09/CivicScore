import { useState } from 'react';
import { violationsAPI } from '../../services/api';
import { AlertTriangle, CheckCircle, AlertCircle, ShieldAlert, ShieldX, Shield } from 'lucide-react';

export default function ViolationManagement() {
    const [citizenId, setCitizenId] = useState('');
    const [severity, setSeverity] = useState('MINOR');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [createdViolation, setCreatedViolation] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!citizenId.trim() || !description.trim()) return;

        // Simple UUID validation
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(citizenId.trim())) {
            setMessage({ type: 'error', text: 'Invalid Citizen ID format. Please enter a valid UUID.' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const violation = await violationsAPI.add(citizenId.trim(), severity, description);
            setCreatedViolation(violation);
            setMessage({ type: 'success', text: 'Violation reported successfully!' });
            setDescription('');
        } catch (error) {
            const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to report violation. Please check the Citizen ID and your connection.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const getSeverityInfo = (sev) => {
        switch (sev) {
            case 'MINOR':
                return {
                    icon: <Shield size={20} />,
                    color: 'var(--warning)',
                    points: '-10 to -25',
                    description: 'Minor infractions like littering, noise complaints'
                };
            case 'MAJOR':
                return {
                    icon: <ShieldAlert size={20} />,
                    color: 'var(--saffron)',
                    points: '-25 to -50',
                    description: 'Significant violations like traffic offenses, public disturbance'
                };
            case 'CRITICAL':
                return {
                    icon: <ShieldX size={20} />,
                    color: 'var(--error)',
                    points: '-50 to -100',
                    description: 'Serious violations affecting community safety'
                };
            default:
                return { icon: <Shield size={20} />, color: 'var(--gray-500)', points: '0', description: '' };
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <AlertTriangle size={32} style={{ marginRight: '12px', color: 'var(--error)' }} />
                    Violation Management
                </h1>
                <p className="page-subtitle">Report civic violations and update citizen scores</p>
            </div>

            {/* Message Display */}
            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '24px' }}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    {message.text}
                </div>
            )}

            <div className="grid grid-2">
                {/* Violation Form */}
                <div className="card card-tricolor">
                    <div className="card-header">
                        <h3 className="card-title">
                            <AlertTriangle size={20} style={{ marginRight: '8px', color: 'var(--error)' }} />
                            Report New Violation
                        </h3>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label" htmlFor="citizenId">Citizen ID (UUID)</label>
                            <input
                                id="citizenId"
                                type="text"
                                className="form-input"
                                placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
                                value={citizenId}
                                onChange={(e) => setCitizenId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Severity Level</label>
                            <div style={{ display: 'flex', gap: '12px' }}>
                                {['MINOR', 'MAJOR', 'CRITICAL'].map((sev) => {
                                    const info = getSeverityInfo(sev);
                                    return (
                                        <button
                                            key={sev}
                                            type="button"
                                            onClick={() => setSeverity(sev)}
                                            style={{
                                                flex: 1,
                                                padding: '16px 12px',
                                                border: `2px solid ${severity === sev ? info.color : 'var(--gray-300)'}`,
                                                borderRadius: 'var(--radius-md)',
                                                background: severity === sev ? `${info.color}15` : 'white',
                                                cursor: 'pointer',
                                                transition: 'all var(--transition-fast)',
                                                textAlign: 'center'
                                            }}
                                        >
                                            <div style={{ color: info.color, marginBottom: '4px', display: 'flex', justifyContent: 'center' }}>
                                                {info.icon}
                                            </div>
                                            <div style={{ fontWeight: '600', color: 'var(--gray-800)', fontSize: '0.875rem' }}>
                                                {sev}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--gray-500)' }}>
                                                {info.points}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="description">Violation Description</label>
                            <textarea
                                id="description"
                                className="form-textarea"
                                placeholder="Describe the violation in detail..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-lg"
                            style={{
                                width: '100%',
                                background: 'linear-gradient(135deg, var(--error) 0%, #f87171 100%)',
                                color: 'white',
                                border: 'none'
                            }}
                            disabled={loading}
                        >
                            {loading ? 'Reporting...' : 'Report Violation'}
                        </button>
                    </form>
                </div>

                {/* Result / Information Panel */}
                <div>
                    {/* Severity Guide */}
                    <div className="card" style={{ marginBottom: '24px' }}>
                        <div className="card-header">
                            <h3 className="card-title">Severity Guide</h3>
                        </div>
                        <div className="card-body">
                            {['MINOR', 'MAJOR', 'CRITICAL'].map((sev) => {
                                const info = getSeverityInfo(sev);
                                return (
                                    <div key={sev} style={{
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: '12px',
                                        padding: '12px 0',
                                        borderBottom: sev !== 'CRITICAL' ? '1px solid var(--gray-200)' : 'none'
                                    }}>
                                        <div style={{ color: info.color }}>{info.icon}</div>
                                        <div>
                                            <div style={{ fontWeight: '600', color: 'var(--gray-800)' }}>{sev}</div>
                                            <div style={{ fontSize: '0.875rem', color: 'var(--gray-600)' }}>{info.description}</div>
                                            <div style={{ fontSize: '0.75rem', color: info.color, marginTop: '4px' }}>
                                                Score Impact: {info.points} points
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Created Violation */}
                    {createdViolation && (
                        <div className="card card-green animate-fade-in">
                            <div className="card-header">
                                <h3 className="card-title">
                                    <CheckCircle size={20} style={{ marginRight: '8px', color: 'var(--green)' }} />
                                    Violation Recorded
                                </h3>
                            </div>
                            <div className="card-body">
                                <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                                    <p style={{ marginBottom: '8px' }}>
                                        <strong>Violation ID:</strong> {createdViolation.violationId}
                                    </p>
                                    <p style={{ marginBottom: '8px' }}>
                                        <strong>Severity:</strong>
                                        <span className={`badge ${createdViolation.severity === 'MINOR' ? 'badge-warning' :
                                            createdViolation.severity === 'MAJOR' ? 'badge-saffron' : 'badge-error'
                                            }`} style={{ marginLeft: '8px' }}>
                                            {createdViolation.severity}
                                        </span>
                                    </p>
                                    <p style={{ marginBottom: '8px' }}>
                                        <strong>Description:</strong> {createdViolation.description}
                                    </p>
                                    <p>
                                        <strong>Recorded:</strong> {new Date(createdViolation.violationTime).toLocaleString('en-IN')}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
