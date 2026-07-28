import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.css';
import authService from './appwrite/auth';
import { login, logout } from './store/authSlice';
import { Header, Footer } from './components';
import { Outlet } from 'react-router-dom';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .catch(() => {
        dispatch(logout());
      })
      .finally(() => setLoading(false));
  }, [dispatch]);

  return !loading ? (
     <div className='min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-200'>
        <Header />
        <main className='flex-grow w-full'>
          <Outlet />
        </main>
        <Footer />
     </div>
  ) : (
    <div className='min-h-screen flex items-center justify-center bg-slate-900 text-indigo-400'>
      <div className='flex flex-col items-center gap-3'>
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-indigo-500 border-r-transparent" />
        <span className='text-sm font-medium tracking-wide text-slate-300'>Loading MegaBlog...</span>
      </div>
    </div>
  );
}

export default App;
