import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hasLgpdConsent, setLgpdConsent, LGPD_CONSENT_EVENT } from '../../services/auth';
import './styles.scss';

export function CookieConsent() {
  const [accepted, setAccepted] = useState(() => hasLgpdConsent());

  useEffect(() => {
    const sync = () => setAccepted(hasLgpdConsent());
    window.addEventListener(LGPD_CONSENT_EVENT, sync);
    return () => window.removeEventListener(LGPD_CONSENT_EVENT, sync);
  }, []);

  if (accepted) return null;

  function handleAccept() {
    setLgpdConsent();
    setAccepted(true);
  }

  return (
    <div className="cookie-consent" role="dialog" aria-label="Consentimento de privacidade">
      <p>
        Utilizamos dados de sessão (token de acesso) para autenticação, conforme nossa{' '}
        <Link to="/privacidade">Política de Privacidade (LGPD)</Link>.
      </p>
      <button type="button" className="cookie-consent__btn" onClick={handleAccept}>
        Entendi e concordo
      </button>
    </div>
  );
}
