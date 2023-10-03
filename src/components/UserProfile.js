import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getDatabase, ref, set, get } from 'firebase/database';
import { Input } from '../components/FormElement';

function UserProfile({ user }) {
  const [userData, setUserData] = useState({});
  const [updateMsg, setUpdateMsg] = useState({});
  const { t } = useTranslation();
  const initData = useMemo(
    () => ({
      username: '',
      openaiID: '',
    }),
    []
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: initData,
    mode: 'onTouched',
  });
  const updateUser = async (updatedUserData) => {
    try {
      // 獲取 Firebase Realtime Database 的根節點
      const database = getDatabase();
      // 指定要更新的路徑（ref）
      const userRef = ref(database, `users/${user.uid}`);
      // 執行資料寫入操作
      await set(userRef, updatedUserData);
      setUpdateMsg({
        state: 'success',
        message: 'Profile updated successfully',
      });
      getUser();
    } catch (error) {
      setUpdateMsg({
        state: 'danger',
        message: `An error occurred while updating the profile: ${error.code}`,
      });
    }
  };
  useEffect(() => {
    const resetForm = () => {
      reset({ ...initData, ...userData });
    };
    resetForm();
  }, [initData, userData, reset]);
  const submit = (data) => {
    updateUser(data);
  };
  const getUser = useCallback(async () => {
    try {
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData(data);
      } else {
        console.log('找不到該使用者資料');
      }
    } catch (error) {
      console.error('讀取資料時發生錯誤:', error);
    }
  }, [user]);
  useEffect(() => {
    getUser();
  }, [getUser]);

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
      <div className='form-group mb-3'>
        <Input
          register={register}
          errors={errors}
          id='username'
          type='text'
          labelText={t('Username')}
          rules={{
            required: {
              value: true,
              message: t('required'),
            },
          }}
          visibleIcon={false}
        />
      </div>
      <div className='form-group mb-3'>
        <label htmlFor='email' className='form-label'>
          {t('Email')}
        </label>
        <input
          id='email'
          type='email'
          defaultValue={userData?.email}
          className={`form-control bg-light`}
          disabled
        />
      </div>
      <div className='mb-4'>
        <Input
          register={register}
          errors={errors}
          id='openaiID'
          type='text'
          labelText={t('OpenAI ID')}
          rules={{}}
          visibleIcon={false}
        />
      </div>
      <button type='submit' className='btn btn-primary py-2 mb-2'>
        {t('Update')}
      </button>
    </form>
  );
}

export default UserProfile;
