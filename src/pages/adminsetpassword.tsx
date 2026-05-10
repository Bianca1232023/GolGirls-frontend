import React from 'react'
import SetPasswordComponent from '../components/setPassword'
import Buttons from '../components/button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const AdminSetPassword = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/login/admin')
  }

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={handleBack} />
      <SetPasswordComponent role="admin" />
      <Footer text="Link expirado? Entre em contato com outro administrador para receber um novo" />
    </div>
  )
}
