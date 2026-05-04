import React from 'react'
import Inputs from '../components/inputLogin'
import Buttons from '../components/button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const ProfessorLogin = () => {
  const [value, setValue] = React.useState('')
  const navigate = useNavigate()

  return (
    <div>
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <Inputs type="email" value={value} onChange={(e) => setValue(e.target.value)} role={'professor'} />
      <Footer text="Problemas com o acesso? Entre em contato com o Administrativo" />
    </div>
  )
}
