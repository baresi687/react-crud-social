import Button from './Button.jsx';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { USER_SIGNUP_URL } from '../settings/api.js';
import { useContext, useEffect, useState } from 'react';
import { postData } from '../utils/fetchFunctions.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required('Please enter a name')
    .matches(/^\w+$/, 'Name must not contain punctuation symbols apart from underscore'),
  email: yup
    .string()
    .trim()
    .required('Please enter an email')
    .matches(/^[\w\-.]+@(stud.)?noroff.no$/, 'Email must be a @noroff.no or @stud.noroff address'),
  password: yup.string().trim().required('Please enter a password').min(8, 'Password must 8 characters or more'),
  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref('password')], 'Passwords do not match')
    .required('Please confirm your password'),
});

function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMSg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auth] = useContext(AuthContext);
  const navigate = useNavigate();

  function onSubmit(data) {
    const payload = data;
    delete payload.confirmPassword;
    setIsSubmitting(true);
    setFormError(false);

    postData(USER_SIGNUP_URL, payload)
      .then((response) => {
        if (response.id) {
          navigate('/sign-in');
        } else {
          setFormError(true);

          switch (response.statusCode) {
            case 429:
              setFormErrorMSg(response.status);
              break;
            case 400:
              setFormErrorMSg(response.errors[0].message);
              break;
            default:
              setFormErrorMSg('Something went wrong.. please try again later');
          }
        }
      })
      .catch(() => {
        setFormError(true);
        setFormErrorMSg('Something went wrong.. please try again later');
      })
      .finally(() => setIsSubmitting(false));
  }

  useEffect(() => {
    if (auth) {
      navigate('/', { replace: true });
    }
  }, [auth, navigate]);

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="username">Username</label>
          <input {...register('name')} name="name" placeholder="Username" />
          {errors.name ? <p>{errors.name.message}</p> : null}
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input {...register('email')} name="email" type="email" placeholder="Email" />
          {errors.email ? <p>{errors.email.message}</p> : null}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input {...register('password')} name="password" type="password" placeholder="Password" />
          {errors.password ? <p>{errors.password.message}</p> : null}
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            {...register('confirmPassword')}
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
          />
          {errors.confirmPassword ? <p>{errors.confirmPassword.message}</p> : null}
        </div>
        <div>
          <Button type="submit" color="#3f51b5bf">
            {isSubmitting ? 'Processing ...' : 'Sign Up'}
          </Button>
        </div>
        {formError && <h2>{formErrorMsg}</h2>}
      </form>
    </>
  );
}

export default SignUp;
