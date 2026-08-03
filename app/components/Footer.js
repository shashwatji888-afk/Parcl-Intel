'use client';

const styles = {
  footer: {},
  links: { display: 'flex', gap: '20px' },
  apiIndicator: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--accent)',
    boxShadow: '0 0 5px rgba(16,185,129,0.8)',
    display: 'inline-block',
    flexShrink: '0',
  },
};

export default function Footer() {
  return (
    <footer className="parcl-footer" role="contentinfo">
      <div className="parcl-footer__copy">
        © 2026 Parcl Intel · Real Estate ML Engine
      </div>
      <div style={styles.links}>
        <a href="/reports" className="parcl-footer__link">Docs</a>
        <a href="#" className="parcl-footer__link">Privacy</a>
        <a href="#" className="parcl-footer__link">Terms</a>
        <a href="#" className="parcl-footer__link parcl-footer__api">
          <span style={styles.apiIndicator} />
          API Online
        </a>
      </div>
    </footer>
  );
}
