import React, { useEffect, useRef, useState } from 'react';
import { Collapse } from 'bootstrap';
import { useTranslation } from 'react-i18next';
import { getAuth } from 'firebase/auth';
import { NavLink, Link } from 'react-router-dom';
import logo from '../assets/chatbot logo.png';

function Navbar({ user, logout }) {
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState('English');
  const auth = getAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const menuToggle = useRef(null);
  const bsCollapse = useRef(null);
  const dataToggle = useRef(null);
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleClick = () => {
    setIsCollapsed((pre) => !pre);
  };

  useEffect(() => {
    dataToggle.current = document.querySelectorAll('[data-toggle]');
    function handleCollapse() {
      bsCollapse.current.hide();
      setIsCollapsed(false);
    }
    if (menuToggle.current) {
      bsCollapse.current = new Collapse(menuToggle.current, {
        toggle: false,
      });

      dataToggle.current.forEach((item) => {
        item.addEventListener('click', handleCollapse);
      });
    }
    return () => {
      dataToggle.current.forEach((item) => {
        item.removeEventListener('click', handleCollapse);
      });
    };
  }, []);

  return (
    <>
      <nav className='navbar navbar-expand-lg bg-white'>
        <div className='container-fluid px-4'>
          <Link className='navbar-brand' to='/'>
            <img src={logo} alt='logo' height='45' className='me-2' />
          </Link>
          <button
            className='navbar-toggler'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarContent'
            aria-controls='navbarContent'
            aria-expanded='false'
            aria-label='Toggle navigation'
            onClick={handleClick}
          >
            {isCollapsed ? (
              <div style={{ textAlign: 'center' }}>
                <i className='bi bi-x-lg ms-1' style={{ fontSize: '26px' }}></i>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <i className='bi bi-list' style={{ fontSize: '35px' }}></i>{' '}
              </div>
            )}
          </button>

          <div
            className='collapse navbar-collapse bg-white'
            id='navbarContent'
            ref={menuToggle}
          >
            <ul className='navbar-nav ms-auto mb-2 mb-lg-0'>
              <li className='nav-item dropdown me-3'>
                <Link
                  className='nav-link dropdown-toggle'
                  to='/'
                  type='button'
                  data-bs-toggle='dropdown'
                  aria-expanded='false'
                >
                  <i className='bi bi-globe me-1'></i> {lang}
                </Link>
                <ul className='dropdown-menu'>
                  <li>
                    <Link
                      className={`dropdown-item ${
                        lang === 'English' ? 'active' : ''
                      }`}
                      onClick={() => {
                        changeLanguage('en');
                        setLang('English');
                      }}
                      data-toggle
                    >
                      English
                    </Link>
                  </li>
                  <li>
                    <Link
                      className={`dropdown-item ${
                        lang === '中文' ? 'active' : ''
                      }`}
                      onClick={() => {
                        changeLanguage('zh');
                        setLang('中文');
                      }}
                      data-toggle
                    >
                      中文
                    </Link>
                  </li>
                </ul>
              </li>

              {user && (
                <>
                  <li className='nav-item me-3'>
                    <NavLink
                      className='nav-link'
                      to='/user/courseList'
                      data-toggle
                    >
                      <i className='bi bi-card-list me-1'></i>
                      {t('Course List')}
                    </NavLink>
                  </li>
                  <li className='nav-item dropdown'>
                    <Link
                      className='nav-link dropdown-toggle'
                      href='#'
                      role='button'
                      data-bs-toggle='dropdown'
                      aria-expanded='false'
                    >
                      <i className='bi bi-person-circle me-1'></i>
                      {t('User')}
                    </Link>
                    <ul className='dropdown-menu'>
                      <li>
                        <NavLink
                          to='/user/userAccount'
                          className='dropdown-item'
                          data-toggle
                        >
                          {t('My Account')}
                        </NavLink>
                      </li>
                      <li>
                        <Link
                          className='dropdown-item'
                          data-toggle
                          onClick={() => logout(auth)}
                        >
                          {t('Log out')}
                        </Link>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
