import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import authService from "./services/auth";
import { login, logout } from "./store/authSlice";
import { Footer, Header } from './components/index';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // Keeping logic isolated inside the effect avoids dependency array bloat
    const checkUser = async () => {
      try {
        const userData = await authService.getCurrentUser();
        console.log(userData);
        if (userData?.success && userData?.user) {
          dispatch(login(userData.user));
        } else {
          dispatch(logout());
        }
      } catch (error) {
        console.error("App boot initialization auth check failed:", error);
        dispatch(logout());
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [dispatch]); // Safe, reliable, and clean dependency architecture

  if (loading) {
    // Optional: Replace null with a global loader spinner component if preferred 
    return null; 
  }

  return (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-400'>
      <div className='w-full block'>
        <Header />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default App;