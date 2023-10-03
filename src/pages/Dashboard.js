import { Outlet, useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Dashboard() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const logout = useCallback(
    async (auth) => {
      try {
        const res = await signOut(auth);
        setUser(null);
        console.log(res);
      } catch (error) {
        console.error(error);
      }
      navigate(0);
    },
    [navigate]
  );
  useEffect(() => {
    const getUser = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          logout(auth);
          setUser(null);
          navigate('/');
          return;
        }
      });
    };
    getUser();
  }, [auth, navigate, logout]);

  return (
    <>
      <Navbar user={user} logout={logout} />
      {user && <Outlet context={[user, logout]} />}
      <Footer />
    </>
  );
}

export default Dashboard;
