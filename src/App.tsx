import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import { InitialPage } from './pages/initialpage'
import { StudentLogin } from './pages/studentlogin'
import { ProfessorLogin } from './pages/professorlogin'
import { AdminLogin } from './pages/adminlogin'
import { AdminRegister } from './pages/adminregister'
import { ProfessorRegister } from './pages/professorregister'
import { ProfessorSetPassword } from './pages/professorsetpassword'
import { AdminSetPassword } from './pages/adminsetpassword'
import { PortaldoAluno } from './pages/studentpage'
import { AppAdmin } from './pages/appadmin'

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
        <Route path="/app/aluno" element={<PortaldoAluno/>} />
        <Route path="/app/admin" element={<AppAdmin/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
