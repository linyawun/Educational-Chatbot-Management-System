import { useState } from 'react';
import {
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from 'firebase/auth';
import { useTranslation } from 'react-i18next';
import { useOutletContext } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../components/FormElement';
function UserUpdatePwd({ user }) {
  const [, logout] = useOutletContext();
  const { t } = useTranslation();
  const auth = getAuth();
  const [updateMsg, setUpdateMsg] = useState({});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    //defaultValues: defaultVal.current,
    mode: 'onTouched',
  });
  const updateUserPassword = async (oldPassword, newPassword) => {
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      console.log(user.email);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);

      setUpdateMsg({
        state: 'success',
        message: 'Password updated successfully, Please log in again',
      });
      setTimeout(() => {
        logout(auth);
      }, 2000);
    } catch (error) {
      setUpdateMsg({
        state: 'danger',
        message: `An error occurred while updating the password: ${error.code}`,
      });
    }
  };
  const submit = ({ currentPassword, newPassword }) => {
    updateUserPassword(currentPassword, newPassword);
  };
  return (
    <form onSubmit={handleSubmit(submit)} className='mb-5'>
      <div
        className={`alert alert-${updateMsg.state} ${
          updateMsg.message ? 'd-block' : 'd-none'
        }`}
        role='alert'
      >
        {t(updateMsg.message)}
      </div>
      <div className='mb-3'>
        <Input
          register={register}
          errors={errors}
          id='currentPassword'
          type='password'
          labelText={t('Current Password')}
          rules={{
            required: {
              value: true,
              message: t('required'),
            },
          }}
          visibleIcon={true}
        />
      </div>
      <div className='mb-4'>
        <Input
          register={register}
          errors={errors}
          id='newPassword'
          type='password'
          labelText={t('New Password')}
          rules={{
            required: {
              value: true,
              message: t('required'),
            },
            minLength: {
              value: 6,
              message: t('Password length must be greater than 6'),
            },
          }}
          visibleIcon={true}
        />
      </div>
      <button type='submit' className='btn btn-primary py-2 mb-2'>
        {t('Update')}
      </button>
    </form>
  );
}
export default UserUpdatePwd;
