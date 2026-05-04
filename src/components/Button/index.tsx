import React from 'react'
import './styles.scss'
import ArrowLeft from '../icons/arrow-left'

interface ButtonProps {
  label: string;
  onClick: () => void;
  type?: 'login' | 'back' | 'default';
  className?: string;
}

const Buttons: React.FC<ButtonProps> = ({ label, onClick, type = 'default', className = '' }) => {
  const buttonClass = `btn btn-${type} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {type === 'back' && <ArrowLeft width="20" height="20" />}
      <span>{label}</span>
    </button>
  );
};

export default Buttons