import React from 'react'
import './styles.scss'
import ArrowLeft from '../icons/arrow-left'

interface ButtonProps {
  label: string;
  onClick?: () => void;
  type?: 'login' | 'back' | 'default';
  className?: string;
  icon?: React.ReactNode;
}

const Buttons: React.FC<ButtonProps> = ({ label, onClick, type = 'default', className = '', icon }) => {
  const buttonClass = `btn btn-${type} ${className}`;

  return (
    <button className={buttonClass} onClick={onClick}>
      {type === 'back' && <ArrowLeft width="20" height="20" />}
      {icon && icon}
      <span>{label}</span>
    </button>
  );
};

export default Buttons