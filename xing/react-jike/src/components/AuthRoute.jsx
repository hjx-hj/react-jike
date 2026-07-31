import { getToken } from '@/utils'
import { Navigate } from 'react-router-dom'

function AuthRoute({ children }) {
  const token = getToken()
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}

export default AuthRoute
