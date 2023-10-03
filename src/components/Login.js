import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useForm } from 'react-hook-form';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { Input } from '../components/FormElement';
function Login({ setActiveItem }) {
  const auth = getAuth();
  const { t } = useTranslation();
  const [isForgotPwd, setIsForgotPwd] = useState(false);
  const [loginMsg, setLoginMsg] = useState('');
  const [resetPwdEmail, setResetPwdEmail] = useState('');
  const [resetMsg, setRestMsg] = useState('');
  const login = useGoogleLogin({
    onSuccess: (codeResponse) => {
      sessionStorage.setItem('token', codeResponse.access_token);
    },
    onError: (error) => console.log('Login Failed:', error),
  });
  const defaultVal = useRef({
    username: '',
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
  const submit = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setLoginMsg('User not found');
          break;
        case 'auth/invalid-email':
          setLoginMsg('Wrong email format');
          break;
        case 'auth/wrong-password':
          setLoginMsg('Wrong paassword');
          break;
        default:
          console.log(error);
      }
    }
  };
  const SendPwdResetEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, resetPwdEmail);

      setRestMsg(
        `Your password reset email should arrive shortly. If you don't see it, please check your spam folder.`
      );
    } catch (error) {
      switch (error.code) {
        case 'auth/user-not-found':
          setRestMsg('User not found');
          break;
        case 'auth/invalid-email':
          setRestMsg('Wrong email format');
          break;
        case 'auth/wrong-password':
          setRestMsg('Wrong paassword');
          break;
        default:
          console.log(error);
      }
    }
  };

  return (
    <div className='col-sm-8 col-11'>
      <form onSubmit={handleSubmit(submit)} className='col'>
        <h2 className='text-primary text-center fw-blod mb-4'>{t('Log in')}</h2>
        <div
          className={`alert alert-danger ${loginMsg ? 'd-block' : 'd-none'}`}
          role='alert'
        >
          {t(loginMsg)}
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
        <button type='submit' className='btn btn-primary py-2 w-100 mb-2'>
          {t('Log in')}
        </button>
      </form>
      <div className='mb-4 text-end'>
        <Link
          className='link-light-grey fw-lighter link'
          onClick={() => setIsForgotPwd((pre) => !pre)}
        >
          {t('Forgot Password?')}
        </Link>
        {isForgotPwd && (
          <div className='text-start'>
            <h5 className='text-primary'> {t('Reset Password')}</h5>
            <label htmlFor='resetPwdEmail' className='form-label'>
              {t('Email')}
            </label>
            <input
              id='resetPwdEmail'
              type='email'
              value={resetPwdEmail}
              onChange={(e) => setResetPwdEmail(e.target.value)}
              placeholder='your@email.com'
              className={`form-control bg-light mb-3`}
              required
            />
            <button
              type='button'
              className='btn btn-primary py-2 w-100 mb-2'
              onClick={() => SendPwdResetEmail()}
            >
              {t('Send Password Reset Email')}
            </button>
            {resetMsg && <p className='mb-0 bg-light p-2'>{resetMsg}</p>}
          </div>
        )}
      </div>
      <div className='text-light-grey d-flex justify-content-between align-items-center mb-4'>
        <p className='fill mb-0 me-3'></p>
        <p className='text-name mb-0'>
          <small>{t('or')}</small>
        </p>
        <p className='fill mb-0 ms-3'></p>
      </div>
      <button
        type='button'
        className='btn btn-outline-dark py-2 w-100 mb-6'
        onClick={() => login()}
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9.99992 5.70667C11.3144 5.70667 12.201 6.27444 12.7066 6.74889L14.6821 4.82C13.4688 3.69222 11.8899 3 9.99992 3C7.26214 3 4.89769 4.57111 3.74658 6.85778L6.00992 8.61556C6.57769 6.92778 8.1488 5.70667 9.99992 5.70667Z'
            fill='#EA4335'
          ></path>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M16.72 10.1557C16.72 9.58016 16.6733 9.16016 16.5722 8.72461H10V11.3224H13.8578C13.78 11.9679 13.36 12.9402 12.4267 13.5935L14.6356 15.3046C15.9578 14.0835 16.72 12.2868 16.72 10.1557Z'
            fill='#4285F4'
          ></path>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M6.01778 11.3841C5.87 10.9485 5.78444 10.4819 5.78444 9.99964C5.78444 9.51742 5.87 9.05076 6.01 8.6152L3.74667 6.85742C3.27222 7.80631 3 8.87187 3 9.99964C3 11.1274 3.27222 12.193 3.74667 13.1419L6.01778 11.3841Z'
            fill='#FBBC05'
          ></path>
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M9.99995 17.0003C11.8899 17.0003 13.4766 16.3781 14.6355 15.3048L12.4266 13.5937C11.8355 14.0059 11.0422 14.2937 9.99995 14.2937C8.14884 14.2937 6.57773 13.0725 6.01773 11.3848L3.75439 13.1425C4.90551 15.4292 7.26217 17.0003 9.99995 17.0003Z'
            fill='#34A853'
          ></path>
        </svg>
        {t('Sign in with Google')}
      </button>
      <p className='text-light-grey fw-lighter text-center'>
        {t("You don't have an account yet?")}{' '}
        <Link className='link' onClick={() => setActiveItem('signup')}>
          {t('Sign up')}
        </Link>
      </p>
    </div>
  );
}

export default Login;
