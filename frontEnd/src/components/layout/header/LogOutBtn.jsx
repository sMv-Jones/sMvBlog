import { useDispatch } from 'react-redux'
import authService from '../../../services/auth'
import { logout } from '../../../store/authSlice'

function LogoutBtn({ className = "" }) {
  const dispatch = useDispatch()

  const logoutHandler = async () => {
    await authService.logout()
    dispatch(logout())
  }

  return (
    <button
      onClick={logoutHandler}
      className={className}
    >
      Logout
    </button>
  )
}

export default LogoutBtn