import Button from './Button.jsx';
import { useState } from 'react';

function SignUp() {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  function onTextInputChange(value, setTarget) {
    setTarget(value);
  }

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            name="username"
            value={userName}
            placeholder="Username"
            onChange={(e) => onTextInputChange(e.target.value, setUserName)}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            name="email"
            value={email}
            type="email"
            placeholder="Email"
            onChange={(e) => onTextInputChange(e.target.value, setEmail)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            value={password}
            type="password"
            placeholder="Password"
            onChange={(e) => onTextInputChange(e.target.value, setPassword)}
          />
        </div>
        <div>
          <label htmlFor="confirm-password">Confirm password</label>
          <input
            name="confirm-password"
            value={confirmPassword}
            type="password"
            placeholder="Confirm password"
            onChange={(e) => onTextInputChange(e.target.value, setConfirmPassword)}
          />
        </div>
        <div>
          <Button type="submit" color="#3f51b5bf">
            Sign Up
          </Button>
        </div>
      </form>
    </>
  );
}

export default SignUp;
