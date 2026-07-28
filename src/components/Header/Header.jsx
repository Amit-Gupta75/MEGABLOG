import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Menu, X, PlusCircle, Grid, Home, LogIn, UserPlus } from 'lucide-react'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true,
      icon: Home
    },
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
      icon: LogIn
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
      icon: UserPlus
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
      icon: Grid
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
      icon: PlusCircle
    },
  ]

  return (
    <header className='py-3.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200'>
      <Container>
        <nav className='flex items-center justify-between'>
          <div className='mr-4'>
            <Link to='/' className='flex items-center'>
              <Logo width='160px' />
            </Link>
          </div>

          {/* Desktop Menu */}
          <ul className='hidden md:flex items-center gap-1.5'>
            {navItems.map((item) =>
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => navigate(item.slug)}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                      location.pathname === item.slug
                        ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    {item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className='ml-2 pl-2 border-l border-slate-200 dark:border-slate-800 flex items-center gap-3'>
                {userData?.name && (
                  <span className='text-xs font-medium px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300'>
                    {userData.name}
                  </span>
                )}
                <LogoutBtn />
              </li>
            )}
          </ul>

          {/* Mobile Menu Button */}
          <div className='md:hidden flex items-center gap-2'>
            {authStatus && userData?.name && (
              <span className='text-xs font-medium px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 max-w-[100px] truncate'>
                {userData.name}
              </span>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none'
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className='md:hidden mt-3 pt-3 border-t border-slate-200 dark:border-slate-800 pb-2 space-y-1'>
            {navItems.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.slug)
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === item.slug
                      ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400 font-semibold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  {item.name}
                </button>
              ) : null
            )}
            {authStatus && (
              <div className='pt-2 border-t border-slate-200 dark:border-slate-800'>
                <LogoutBtn />
              </div>
            )}
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header
