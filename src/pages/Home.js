import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Signup from '../components/Signup';
import Login from '../components/Login';
function Home() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('login');

  useEffect(() => {
    const getUser = async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          navigate('/user/courseList');
        } else {
          navigate('/');
          return;
        }
      });
    };
    getUser();
  }, [auth, navigate]);
  return (
    <div className='container-fluid'>
      <div className='row container-vh'>
        <div className='col-md-6 col-12 bg-login'>
          <div className='row justify-content-center login-block'>
            {activeItem === 'login' ? (
              <Login setActiveItem={setActiveItem} />
            ) : (
              <Signup setActiveItem={setActiveItem} />
            )}
          </div>
        </div>
        <div className='col-6 bg-gradient-animation d-md-block d-none'>
          <div className='bg-opacity'>
            <h1 className='p-5 text-white fw-bold slogan'>
              <i className='bi bi-caret-right-fill me-1'></i>
              Educational <br />
              Chatbot <br />
              for Digital <br />
              Learning.
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Home;
