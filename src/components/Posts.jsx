import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getFromStorage } from '../utils/storage.js';
import { GET_POSTS_URL } from '../settings/api.js';
import { posts as postsStyles } from './Posts.module.scss';
import { Link } from 'react-router-dom';

function Posts() {
  const { accessToken } = getFromStorage('userData');
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleImgError(e) {
    e.currentTarget.parentElement.remove();
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
      <h1>Posts</h1>
      {isLoading && <div className="loader"></div>}
      <section className={postsStyles}>
        {posts
          .filter(({ media }) => media)
          .map(({ id, title, media, author }) => {
            return (
              <Link to={`/post-details/${id}`} key={id} className="post-container">
                <img src={media} alt={title} onError={handleImgError} />
                <h2 className="post-heading">{title}</h2>
                <p>
                  By <span className="author">{author.name}</span>
                </p>
              </Link>
            );
          })}
      </section>
    </>
  );
}

export default Posts;
