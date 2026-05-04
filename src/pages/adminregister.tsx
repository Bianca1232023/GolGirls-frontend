import InputRegister from '../components/inputRegister'
import Buttons from '../components/button'
import Footer from '../components/footer'
import { useNavigate } from 'react-router-dom'

export const AdminRegister = () => {
  const navigate = useNavigate()

  return (
    <div style={{ paddingBottom: '5rem' }}>
      <Buttons type="back" label="Voltar" onClick={() => navigate(-1)} />
      <InputRegister role="admin" />
      <Footer text="Acesso restrito. Apenas administradores autorizados." />
    </div>
  )
}
