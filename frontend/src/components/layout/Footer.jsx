import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="footer animate-fade-in">
            <div className="footer-container">
                <div className="footer-brand" style={{ color: 'var(--navy)' }}>
                    🇮🇳 Developed India 2047 🇮🇳
                </div>
                <p className="footer-text" style={{ color: 'var(--gray-600)' }}>
                    CivicScore - Incentivizing Responsible Citizenship
                </p>
                <div className="footer-divider" style={{ margin: '20px auto', width: '50px', height: '3px', background: 'var(--gradient-tricolor)', borderRadius: '10px' }}></div>
                <p className="footer-text" style={{ marginTop: '8px', opacity: 0.8, color: 'var(--gray-500)', fontSize: '0.8rem' }}>
                    Made with <Heart size={14} style={{ display: 'inline', verticalAlign: 'middle', color: '#e11d48' }} fill="#e11d48" /> for India
                </p>
            </div>
        </footer>
    );
}
