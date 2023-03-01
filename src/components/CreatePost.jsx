import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

function CreatePost() {
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    if (!userData) {
      navigate('/sign-in', { replace: true });
    } else {
      setAuth(userData.accessToken);
    }
  }, [auth, setAuth, userData, navigate]);

  return (
    <>
      <h1>Create Post</h1>
      <h2>Page coming soon ...</h2>
    </>
  );
}

export default CreatePost;
