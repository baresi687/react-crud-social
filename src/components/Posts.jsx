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

        setPosts(responseJSON);
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    }
    getData();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong.. please try again later</div>;
  }

  return (
    <>
      <h1>Posts</h1>
      <section className={postsStyles}>
        {posts
          .filter(({ media }) => media)
          .map(({ id, title, media, author }) => {
            return (
              <div key={id}>
                <img src={media} alt={title} onError={handleImgError} />
                <h2>{title}</h2>
                <p>By {author.name}</p>
              </div>
            );
          })}
      </section>
    </>
  );
}

export default Posts;
