import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { getFromStorage } from '../utils/storage.js';
import { GET_POSTS_URL } from '../settings/api.js';
import { sortPosts, posts as postsStyles } from './Posts.module.scss';
import { Link } from 'react-router-dom';
import { handleImgError } from '../utils/validation.js';

function Posts() {
  const { accessToken } = getFromStorage('userData');
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [sortBy, setSortBy] = useState('created');
  const [sortOrder, setSortOrder] = useState('desc');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function handleSortBy(e) {
    setSortBy(e.target.value);
  }

  function handleDescAsc(e) {
    setSortOrder(e.target.value);
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
        const response = await fetch(`${GET_POSTS_URL}&sort=${sortBy}&sortOrder=${sortOrder}`, options);
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
  }, [accessToken, sortBy, sortOrder]);

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
      <section className={sortPosts}>
        <div className={'sort-by'}>
          <label htmlFor={'sort-posts'}>Sort by:</label>
          <select id={'sort-posts'} onChange={handleSortBy}>
            <option value={'created'}>Created</option>
            <option value={'title'}>Title</option>
          </select>
        </div>
        <div className={'asc-desc'}>
          <div>
            <label htmlFor={'desc'}>Descending</label>
            <input
              type={'radio'}
              id={'desc'}
              name={'asc-desc'}
              value={'desc'}
              defaultChecked
              onChange={handleDescAsc}
            />
          </div>
          <div>
            <label htmlFor={'asc'}>Ascending</label>
            <input type={'radio'} id={'asc'} name={'asc-desc'} value={'asc'} onChange={handleDescAsc} />
          </div>
        </div>
      </section>
      {isLoading && (
        <>
          <div style={{ height: '100vh' }}>
            <div className={'loader'}></div>
          </div>
        </>
      )}
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
