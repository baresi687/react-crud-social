import Button from './Button.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { USER_LOGIN_URL } from '../settings/api.js';
import { useContext, useEffect, useState } from 'react';
import { postData } from '../utils/fetchFunctions.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const schema = yup.object({
  email: yup
    .string()
    .trim()
    .required('Please enter an email')
    .matches(/^[\w\-.]+@(stud.)?noroff.no$/, 'Email must be a @noroff.no or @stud.noroff address'),
  password: yup.string().trim().required('Please enter a password').min(8, 'Password must 8 characters or more'),
});
function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMSg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [auth, setAuth] = useContext(AuthContext);

  useEffect(() => {
    if (auth) {
      navigate('/', { replace: true });
    }
  }, [auth, navigate]);

  function onSubmit(data) {
    const payload = data;
    delete payload.confirmPassword;
    setIsSubmitting(true);
    setFormError(false);

    postData(USER_LOGIN_URL, payload)
      .then((response) => {
        if (response.accessToken) {
          localStorage.setItem('token', JSON.stringify(response.accessToken));
          navigate('/');
          setAuth(response.accessToken);
        } else {
          setFormError(true);
          setFormErrorMSg(response.errors[0].message);
        }
      })
      .catch(() => {
        setFormError(true);
        setFormErrorMSg('Something went wrong.. please try again later');
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <>
      <h1>Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="email">Email</label>
          <input {...register('email')} name="email" type="email" placeholder="Email" />
          <p>{errors.email?.message}</p>
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input {...register('password')} name="password" type="password" placeholder="Password" />
          <p>{errors.password?.message}</p>
        </div>
        <div>
          <Button type="submit" color="#3f51b5bf">
            {isSubmitting ? 'Processing ...' : 'Sign In'}
          </Button>
        </div>
        {formError && <h2>{formErrorMsg}</h2>}
      </form>
    </>
  );
}

export default SignIn;
