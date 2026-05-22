import { useNavigate, useLocation } from 'react-router-dom';
import Buttons from '../components/Button';
import { hasLgpdConsent, setLgpdConsent } from '../services/auth';
import '../styles/privacidade.scss';

export function PrivacidadePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;

  function handleAccept() {
    setLgpdConsent();
    navigate(from && from !== '/privacidade' ? from : '/', { replace: true });
  }

  return (
    <div className="priv-page">
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <h1>Política de Privacidade e Proteção de Dados (LGPD)</h1>
      <p className="priv-updated">GoLGirls — Lei nº 13.709/2018</p>

      <section>
        <h2>1. Controlador e finalidade</h2>
        <p>
          A plataforma GoLGirls trata dados pessoais de alunas, responsáveis, professoras e equipe
          administrativa para gestão esportiva, pedagógica e operacional do projeto de empoderamento
          de meninas negras e periféricas.
        </p>
      </section>

      <section>
        <h2>2. Dados coletados</h2>
        <ul>
          <li>Identificação: nome, e-mail, matrícula</li>
          <li>Dados educacionais: turma, escola, núcleo, bairro, idade</li>
          <li>Dados de acesso: token de sessão (armazenado no navegador até logout ou fechamento da aba)</li>
        </ul>
      </section>

      <section>
        <h2>3. Base legal e segurança</h2>
        <p>
          O tratamento fundamenta-se em execução de políticas públicas/educacionais e legítimo interesse,
          com medidas técnicas: comunicação HTTPS em produção, senhas com hash no servidor (bcrypt),
          autenticação JWT, controle de acesso por perfil e minimização de dados exibidos.
        </p>
      </section>

      <section>
        <h2>4. Compartilhamento</h2>
        <p>
          Dados não são vendidos. Acesso restrito a professoras (suas turmas) e administradoras autorizadas.
          E-mails transacionais (convite, redefinição de senha) via provedor SMTP configurado no backend.
        </p>
      </section>

      <section>
        <h2>5. Direitos do titular</h2>
        <p>
          Você pode solicitar acesso, correção ou exclusão de dados entrando em contato com a equipe
          administrativa do projeto GoLGirls.
        </p>
      </section>

      <section>
        <h2>6. Cookies e armazenamento local</h2>
        <p>
          Utilizamos armazenamento de sessão no navegador para o token de autenticação e preferência de
          consentimento desta política. Não utilizamos cookies de rastreamento publicitário.
        </p>
      </section>

      <button type="button" className="priv-accept-btn" onClick={handleAccept}>
        {hasLgpdConsent() ? 'Continuar' : 'Li e concordo'}
      </button>
    </div>
  );
}
