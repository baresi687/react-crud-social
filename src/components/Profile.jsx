import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { GET_USER_POSTS_URL } from '../settings/api.js';
import { getFromStorage } from '../utils/storage.js';
import Button from './Button.jsx';
import { profileStyles } from './Profile.module.scss';

function Profile() {
  const { accessToken } = getFromStorage('userData');
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (!accessToken) {
      navigate('/sign-in', { replace: true });
    } else {
      setAuth(accessToken);
    }
  }, [auth, setAuth, accessToken, navigate]);

  useEffect(() => {
    async function getData() {
      const options = { headers: { Authorization: `Bearer ${accessToken}` } };

      try {
        setIsLoading(true);
        setIsError(false);
        const response = await fetch(GET_USER_POSTS_URL, options);
        const responseJSON = await response.json();

        if (response.status === 200) {
          setUserPosts(responseJSON.posts);
        } else {
          setIsError(true);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, [accessToken]);

  if (isError) {
    return (
      <>
        <p>Something went wrong getting posts ...</p>
        <p>Please try again later</p>
      </>
    );
  }

  return (
    <>
      <h1>Profile</h1>
      <section>
        {isLoading && <div className={'loader'}></div>}
        <h3>Your posts</h3>
        <div className={profileStyles}>
          {userPosts.length ? (
            userPosts.map(({ id, title, body }) => {
              return (
                <div key={id} className={'user-post'}>
                  <Link to={`/post-details/${id}`}>
                    <h2>{title}</h2>
                    <p>{body}</p>
                  </Link>
                  <div className={'action-btn'}>
                    <Button color={'darkred'}>Delete</Button>
                    <Button color={'darkgoldenrod'}>Edit</Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div>
              <h4>You have no posts</h4>
              <Link to={'/create-post'}>Create post</Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Profile;
