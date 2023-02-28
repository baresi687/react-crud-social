import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getFromStorage } from '../utils/storage.js';
import { GET_POSTS_URL } from '../settings/api.js';
import { posts as postsStyles } from './Posts.module.scss';

const { accessToken } = getFromStorage('userData');
function Posts() {
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('userData'));
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleImgError(e) {
    e.currentTarget.parentElement.remove();
  }

  useEffect(() => {
    if (!userData) {
      navigate('/signin', { replace: true });
    } else {
      setAuth(userData.accessToken);
    }
  }, [auth, setAuth, userData, navigate]);

  useEffect(() => {
    async function getData() {
      const options = {
        method: 'GET',
        headers: { Authorization: `Bearer ${accessToken}` },
      };

      try {
        setIsLoading(true);
        setIsError(false);
        const response = await fetch(GET_POSTS_URL, options);
        const responseJSON = await response.json();

        if (response.status === 200) {
          setPosts(responseJSON);
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
  }, []);

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
      <h1>Posts</h1>
      {isLoading && <div className="loader"></div>}
      <section className={postsStyles}>
        {posts
          .filter(({ media }) => media)
          .map(({ id, title, media, author }) => {
            return (
              <div key={id} className="post-container">
                <img src={media} alt={title} onError={handleImgError} />
                <h2 className="post-heading">{title}</h2>
                <p>
                  By <span className="author">{author.name}</span>
                </p>
              </div>
            );
          })}
      </section>
    </>
  );
}

export default Posts;
