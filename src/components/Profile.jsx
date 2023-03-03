import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { GET_USER_POSTS_URL, EDIT_DELETE_USER_POST } from '../settings/api.js';
import { getFromStorage } from '../utils/storage.js';
import Button from './Button.jsx';
import { profileStyles } from './Profile.module.scss';
import { postData } from '../utils/fetchFunctions.js';

function Profile() {
  const { accessToken } = getFromStorage('userData');
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isActionBtnError, setIsActionBtn] = useState(false);

  function handleDeletePost(id) {
    setIsLoading(true);
    postData(EDIT_DELETE_USER_POST + id, null, 'DELETE', accessToken)
      .then((response) => {
        if (response === 204) {
          setUserPosts([...userPosts.filter((post) => post.id !== id)]);
        } else {
          setIsActionBtn(true);
        }
      })
      .catch(() => {
        setIsActionBtn(true);
      })
      .finally(() => setIsLoading(false));
  }

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
        <h3>Your posts</h3>
        {isLoading && (
          <>
            <div style={{ height: '100vh' }}>
              <div className={'loader'}></div>
            </div>
          </>
        )}
        <div className={profileStyles}>
          {userPosts.length
            ? userPosts.map(({ id, title, body }) => {
                return (
                  <div key={id} className={'user-post'}>
                    <Link to={`/post-details/${id}`}>
                      <h2>{title}</h2>
                      <p>{body}</p>
                    </Link>
                    <div className={'action-btn'}>
                      <Button color={'darkred'} onClick={() => handleDeletePost(id)}>
                        Delete
                      </Button>
                      <Button color={'darkgoldenrod'}>Edit</Button>
                    </div>
                  </div>
                );
              })
            : !isLoading && (
                <div>
                  <h4>You have no posts</h4>
                  <Link to={'/create-post'}>Create post</Link>
                </div>
              )}
        </div>
        {isActionBtnError && <p>Something went wrong deleting post.. Please try again later</p>}
      </section>
    </>
  );
}

export default Profile;
