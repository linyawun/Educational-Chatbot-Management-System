import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getDatabase, ref, set } from 'firebase/database';
import { Input } from '../components/FormElement';
function Signup({ setActiveItem }) {
  const auth = getAuth();
  const { t } = useTranslation();
  const [signupMsg, setSignupMsg] = useState('');

  const defaultVal = useRef({
    username: '',
    email: '',
    password: '',
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: defaultVal.current,
    mode: 'onTouched',
  });
  const submit = async ({ username, email, password }) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, {
        displayName: username,
      });
      writeUserData(res.user.uid, username, email);
    } catch (error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setSignupMsg('Email already exist');
          break;
        case 'auth/invalid-email':
          setSignupMsg('Wrong email format');
          break;
        case 'auth/weak-password':
          setSignupMsg('Weak paassword');
          break;
        default:
          console.log(error);
      }
    }
  };
  function writeUserData(userId, username, email) {
    const db = getDatabase();
    set(ref(db, 'users/' + userId), {
      username: username,
      email: email,
      openaiId: '',
    });
  }

  return (
    <div className='col-sm-8 col-11'>
      <form onSubmit={handleSubmit(submit)} className='col'>
        <h2 className='text-primary text-center fw-blod mb-4'>
          {t('Sign up')}
        </h2>
        <div
          className={`alert alert-danger ${signupMsg ? 'd-block' : 'd-none'}`}
          role='alert'
        >
          {t(signupMsg)}
        </div>
        <div className='mb-3'>
          <Input
            register={register}
            errors={errors}
            id='username'
            type='username'
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
        <div className='mb-3'>
          <Input
            register={register}
            errors={errors}
            id='email'
            type='email'
            labelText={t('Email')}
            rules={{
              required: {
                value: true,
                message: t('required'),
              },
              pattern: {
                value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                message: t(
                  'wrong format, symbols such as @ and . are required'
                ),
              },
            }}
            visibleIcon={false}
          />
        </div>
        <div className='mb-4'>
          <Input
            register={register}
            errors={errors}
            id='password'
            type='password'
            labelText={t('Password')}
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
        <button type='submit' className='btn btn-primary py-2 w-100 mb-4'>
          {t('Sign up')}
        </button>
      </form>
      <p className='text-light-grey fw-lighter text-center'>
        {t('You already have an account?')}{' '}
        <Link className='link' onClick={() => setActiveItem('login')}>
          {t('Log in')}
        </Link>
      </p>
    </div>
  );
}

export default Signup;
