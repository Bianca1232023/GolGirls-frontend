import React from 'react'
import InputRegister from '../components/inputRegister'
import Buttons from '../components/button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const ProfessorRegister = () => {
  const navigate = useNavigate()

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <InputRegister role="professor" />
      <Footer text="Problemas com o cadastro? Entre em contato com o Administrativo" />
    </div>
  )
}
