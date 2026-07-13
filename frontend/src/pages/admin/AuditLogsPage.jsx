import { useState, useEffect } from 'react';
import { auditLogsAPI } from '../../services/api';
import { ClipboardList, Shield, User, Info, Calendar, Loader, AlertCircle } from 'lucide-react';

export default function AuditLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadLogs();
    }, []);

    const loadLogs = async () => {
        setLoading(true);
        try {
            const data = await auditLogsAPI.getAll();
            setLogs(data);
        } catch (err) {
            setError('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const getActionBadge = (action) => {
        let color = 'var(--navy)';
        if (action.includes('ADD')) color = 'var(--saffron)';
        if (action.includes('RESOLVE')) color = 'var(--green)';

        return (
            <span className="badge" style={{ background: `${color}15`, color: color, fontWeight: 'bold' }}>
                {action}
            </span>
        );
    };

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <h1 className="page-title">
                    <ClipboardList size={32} style={{ marginRight: '12px', color: 'var(--navy)' }} />
                    Audit Logs
                </h1>
                <p className="page-subtitle">Track all administrative actions performed in the system</p>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <Loader size={48} className="animate-spin" style={{ color: 'var(--navy)' }} />
                </div>
            ) : error ? (
                <div className="alert alert-error">
                    <AlertCircle size={20} />
                    {error}
                </div>
            ) : (
                <div className="card">
                    <div className="table-responsive">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Timestamp</th>
                                    <th>Admin</th>
                                    <th>Action</th>
                                    <th>Target</th>
                                    <th>Description</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--gray-400)' }}>
                                            No audit logs found
                                        </td>
                                    </tr>
                                ) : (
                                    logs.map((log) => (
                                        <tr key={log.id}>
                                            <td style={{ whiteSpace: 'nowrap', fontSize: '0.85rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Calendar size={14} style={{ color: 'var(--gray-400)' }} />
                                                    {new Date(log.timestamp).toLocaleString('en-IN')}
                                                </div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <Shield size={14} style={{ color: 'var(--navy)' }} />
                                                    {log.adminUsername || 'SYSTEM'}
                                                </div>
                                            </td>
                                            <td>{getActionBadge(log.action)}</td>
                                            <td style={{ fontSize: '0.85rem' }}>
                                                <span style={{ color: 'var(--gray-500)' }}>{log.targetType}:</span>
                                                <br />
                                                <span style={{ fontWeight: '500' }}>{log.targetId}</span>
                                            </td>
                                            <td style={{ fontSize: '0.9rem' }}>{log.description}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
