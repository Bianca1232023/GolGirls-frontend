import React from 'react';
import './styles.scss';

interface FooterProps {
  text: string;
}

const Footer: React.FC<FooterProps> = ({ text }) => {
  return (
    <footer className="footer">
      <p className="footer__text">{text}</p>
    </footer>
  );
};

export default Footer;
