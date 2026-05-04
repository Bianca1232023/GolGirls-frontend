import React from 'react'
import Inputs from '../components/inputLogin'
import Buttons from '../components/button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const StudentLogin = () => {
  const [value, setValue] = React.useState('')
  const navigate = useNavigate()

  return (
    <div>
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <Inputs type="text" value={value} onChange={(e) => setValue(e.target.value)} role={'aluno'} />
      <Footer text="Não tem acesso? Entre em contato com o seu(a) Professor(a) para criar sua conta" />
    </div>
  )
}
