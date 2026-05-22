import { Navigate } from 'react-router-dom'

/** Após login, professor vai direto ao painel de gestão. */
export const AppProfessor = () => <Navigate to="/professor/painel" replace />
