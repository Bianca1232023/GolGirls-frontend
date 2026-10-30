import Buttons from '../components/Button';
import ForgotPasswordComponent from '../components/forgotPassword';
import Footer from '../components/footer';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import '../styles/golgirls-design.scss';

export const AdminForgotPassword = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }
    navigate('/login/admin');
  };

  return (
    <AppShell publicPage>
      <div className="gg-login-page">
        <div className="forgot-pwd-back-btn-container">
          <Buttons type="back" label="Voltar" onClick={handleBack} />
        </div>
        <ForgotPasswordComponent role="admin" />
        <Footer text="Lembrou sua senha? Volte para o login e acesse sua conta" />
      </div>
    </AppShell>
  );
};
