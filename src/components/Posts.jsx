import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function Posts() {
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
      <h1>Posts</h1>
    </>
  );
}

export default Posts;
