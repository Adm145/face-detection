import { Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AdminOnlyNotice from './AdminOnlyNotice'

export default function RequireAdmin({ message }) {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <AdminOnlyNotice message={message} />
  }

  return <Outlet />
}
