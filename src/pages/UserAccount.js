import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import UserProfile from '../components/UserProfile';
import UserUpdatePwd from '../components/UserUpdatePwd';
function UserAccount() {
  const [user] = useOutletContext();
  const [accountTab, setAccountTab] = useState('profile');
  const { t } = useTranslation();
  return (
    <div className='container container-vh'>
      <h2 className='text-primary my-4'>{t('My Account')}</h2>
      <ul className='nav nav-underline mb-3'>
        <li className='nav-item'>
          <button
            className={`nav-link ${accountTab === 'profile' ? 'active' : ''}`}
            onClick={() => setAccountTab('profile')}
          >
            {t('Profile')}
          </button>
        </li>
        <li className='nav-item'>
          <button
            className={`nav-link ${accountTab === 'updatePwd' ? 'active' : ''}`}
            onClick={() => setAccountTab('updatePwd')}
          >
            {t('Update Password')}
          </button>
        </li>
      </ul>
      {accountTab === 'profile' ? (
        <UserProfile user={user} />
      ) : (
        <UserUpdatePwd user={user} />
      )}
    </div>
  );
}

export default UserAccount;
