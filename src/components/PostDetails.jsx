import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GET_POST_DETAILS } from '../settings/api.js';
import { getFromStorage } from '../utils/storage.js';
import { post as postStyles } from './PostDetails.module.scss';
import { AuthContext } from '../context/AuthContext.jsx';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const backBtnStyle = { margin: '1.5rem 0' };

function PostDetails() {
  const [auth, setAuth] = useContext(AuthContext);
  const { accessToken } = getFromStorage('userData');
  const { id } = useParams();
  const [post, setPost] = useState('df');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

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
        const response = await fetch(`${GET_POST_DETAILS}${id}?_author=true&_comments=true&reactions=true`, options);
        const responseJSON = await response.json();

        if (response.status === 200) {
          setPost(responseJSON);
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
  }, [id, accessToken]);

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
      <h1>Post Details</h1>
      <section>
        {isLoading && <div className="loader"></div>}
        <p style={backBtnStyle}>
          To >> <Link to={'/posts'}>Posts page</Link>
        </p>
        <div className={postStyles}>
          <div>
            <h2>{post.title}</h2>
            {post.author && (
              <small className="author">
                By <span>{post.author.name}</span> on{' '}
                {new Date(post.created).toLocaleDateString(undefined, dateOptions)}
              </small>
            )}
            <p>{post.body}</p>
            {post.tags && post.tags.length && post.tags.join() ? (
              <small className="tags">
                Tags:
                {post.tags
                  .filter((tag) => tag.length > 1)
                  .map((tag, index, arr) => (
                    <span key={index}>
                      <Link to={'#'} href="#">
                        {tag}
                      </Link>
                      {index < arr.length - 1 && ', '}
                    </span>
                  ))}
              </small>
            ) : null}
          </div>
          <div>
            <img src={post.media} alt={post.title} />
          </div>
        </div>
      </section>
    </>
  );
}

export default PostDetails;
