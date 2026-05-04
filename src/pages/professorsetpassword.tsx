import React from 'react'
import SetPasswordComponent from '../components/setPassword'
import Buttons from '../components/button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const ProfessorSetPassword = () => {
  const navigate = useNavigate()

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <SetPasswordComponent />
      <Footer text="Link expirado? Entre em contato com o Administrativo para receber um novo" />
    </div>
  )
}
