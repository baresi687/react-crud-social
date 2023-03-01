import { getFromStorage } from '../utils/storage.js';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { Link } from 'react-router-dom';

function Home() {
  const { name } = getFromStorage('userData');
  const [auth] = useContext(AuthContext);

  return (
    <>
      <h1>SocialMedia</h1>
      {auth && name ? (
        <>
          <h2>
            Hello <strong>{name}</strong>! 👋️
          </h2>
          <h3>Now you can get social</h3>
          <p>
            To get social you should check out the <Link to={'/posts'}>Posts</Link> page.
          </p>
          <p>
            Or, if you are really feeling social you could <Link to={'/create-post'}>Create a Post</Link>
          </p>
          <p>
            You can adjust the level of social on your <Link to={'/profile'}>Profile page</Link>
          </p>
        </>
      ) : (
        <>
          <h2>The best Social social media</h2>
          <p>
            To get social, head to the <Link to={'/sign-up'}>Sign Up</Link> page.
          </p>
          <p>
            You've been social before? Then you can <Link to={'/sign-in'}>Sign In</Link>
          </p>
        </>
      )}
    </>
  );
}

export default Home;
