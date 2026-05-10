import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import { InitialPage } from './pages/InitialPage'
import { StudentLogin } from './pages/studentlogin'
import { ProfessorLogin } from './pages/professorlogin'
import { AdminLogin } from './pages/adminlogin'
import { AdminRegister } from './pages/adminregister'
import { ProfessorRegister } from './pages/professorregister'
import { ProfessorSetPassword } from './pages/professorsetpassword'
import { AdminSetPassword } from './pages/adminsetpassword'
import { AppAdmin } from './pages/appadmin'
import { AppAluno } from './pages/appaluno'
import { AppProfessor } from './pages/appprofessor'
import { ProfessorForgotPassword } from './pages/professorforgotpassword'
import { AdminForgotPassword } from './pages/adminforgotpassword'
import { ProfessorResetPassword } from './pages/professorresetpassword'
import { AdminResetPassword } from './pages/adminresetpassword'
import { AdminPainel } from './pages/adminpainel'
import { AdminGerenciarConvites } from './pages/admingerenciarconvites'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/login/aluno" element={<StudentLogin />} />
        <Route path="/login/professor" element={<ProfessorLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/professor/definir-senha" element={<ProfessorSetPassword />} />
        <Route path="/admin/definir-senha" element={<AdminSetPassword />} />
        <Route path="/register/professor" element={<ProfessorRegister />} />
        <Route path="/register/admin" element={<AdminRegister />} />
        <Route path="/app/aluno" element={<AppAluno/>} />
        <Route path="/app/professor" element={<AppProfessor/>} />
        <Route path="/app/admin" element={<AppAdmin/>} />
        <Route path="/professor/esqueci-senha" element={<ProfessorForgotPassword/>} />
        <Route path="/admin/esqueci-senha" element={<AdminForgotPassword/>} />
        <Route path="/professor/redefinir-senha" element={<ProfessorResetPassword/>} />
        <Route path="/admin/redefinir-senha" element={<AdminResetPassword/>} />
        <Route path="/admin/painel" element={<AdminPainel/>} />
        <Route path="/admin/convites" element={<AdminGerenciarConvites/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
