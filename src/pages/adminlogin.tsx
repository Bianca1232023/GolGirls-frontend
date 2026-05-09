import React from 'react'
import Inputs from '../components/inputLogin'
import Buttons from '../components/Button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const AdminLogin = () => {
  const [value, setValue] = React.useState('')
  const navigate = useNavigate()

  return (
    <div>
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <Inputs type="email" value={value} onChange={(e) => setValue(e.target.value)} role={'admin'} />
      <Footer text="Acesso restrito. Apenas administradores autorizados." />
    </div>
  )
}
