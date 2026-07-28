import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'
import { LogOut } from 'lucide-react'

function LogoutBtn() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
            navigate('/login')
        })
    }

    return (
        <button
            className='inline-flex items-center gap-1.5 px-4 py-2 font-medium text-slate-700 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg duration-200 cursor-pointer text-sm'
            onClick={logoutHandler}
        >
            <LogOut className='w-4 h-4' />
            Logout
        </button>
    )
}

export default LogoutBtn
