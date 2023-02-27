import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    if (!token) {
      navigate('/signin', { replace: true });
    } else {
      setAuth(token);
    }
  }, [setAuth, auth, token, navigate]);

  return (
    <>
      <h1>Profile</h1>
    </>
  );
}

export default Profile;
