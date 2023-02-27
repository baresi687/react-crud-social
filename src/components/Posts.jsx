import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Posts() {
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    if (!userData) {
      navigate('/signin', { replace: true });
    } else {
      setAuth(userData.accessToken);
    }
  }, [auth, setAuth, userData, navigate]);

  return (
    <>
      <h1>Posts</h1>
    </>
  );
}

export default Posts;
