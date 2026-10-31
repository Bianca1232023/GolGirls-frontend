import React from "react";
import "./styles.scss";
import bell from "../../assets/bell.svg";

interface HeaderPerfilProps {
  name: string;
  matricula: string;
  turma?: string | null;
  escola?: string | null;
  polo?: string | null;
  photoUrl?: string | null;
}

const HeaderPerfil: React.FC<HeaderPerfilProps> = ({
  name,
  matricula,
  turma,
  escola,
  polo,
  photoUrl,
}) => {
  const initials =
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase() || 'A';

  return (
    <header className="header-perfil">
        <div
          className="header-perfil__photo"
          role="img"
          aria-label={photoUrl ? `Foto de ${name || 'aluna'}` : `Iniciais de ${name || 'aluna'}`}
        >
          {photoUrl ? (
            <img src={photoUrl} alt="" />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
      <div className="header-perfil__content">
        <h1 className="header-perfil__name">{name || 'Aluna'}</h1>
        <p className="header-perfil__matricula">
          <span className="header-perfil__label">Matrícula:</span> {matricula || 'Não informada'}
        </p>
        <div className="header-perfil__details">
          <p className="header-perfil__detail">
            <span className="header-perfil__label">Turma:</span> {turma || 'Não informada'}
          </p>
          <p className="header-perfil__detail">
            <span className="header-perfil__label">Escola:</span> {escola || 'Não informada'}
          </p>
          <p className="header-perfil__detail">
            <span className="header-perfil__label">Polo:</span> {polo || 'Não informado'}
          </p>
        </div>
      </div>
      <div className="header-perfil__actions">
        <img className="header-perfil__notification" src={bell} alt="Notificações" />
      </div>
    </header>
  );
};

export default HeaderPerfil;