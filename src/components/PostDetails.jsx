import { useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { GET_POST_DETAILS } from '../settings/api.js';
import { getFromStorage } from '../utils/storage.js';
import { postStyles, postComments } from './PostDetails.module.scss';
import { AuthContext } from '../context/AuthContext.jsx';
import { handleImgError } from '../utils/validation.js';
import { postData } from '../utils/fetchFunctions.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { string } from 'yup';
import Button from './Button.jsx';

const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
const backBtnStyle = { margin: '1.5rem 0' };
const schema = yup.object({
  body: string().required('Please enter a comment'),
});

function PostDetails() {
  const [auth, setAuth] = useContext(AuthContext);
  const { accessToken } = getFromStorage('userData');
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [reactions, setReactions] = useState(null);
  const [comments, setComments] = useState([]);
  const [postCommentError, setPostCommentError] = useState('');
  const [commentSubmitted, setCommentSubmitted] = useState(1);
  const [isComment, setIsComment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmoji, setIsEmoji] = useState(false);
  const [emoji, setEmoji] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const navigate = useNavigate();

  function handleAvatarError(e) {
    e.target.remove();
  }

  function handleReaction(e) {
    const emoji = e.target.dataset.emoji;
    const REACT_TO_POST = GET_POST_DETAILS + id + '/react/' + emoji;

    postData(REACT_TO_POST, emoji, 'PUT', accessToken)
      .then((response) => {
        if (response.postId) {
          setIsEmoji(true);
          setEmoji([emoji]);
        } else {
          setIsError(true);
        }
      })
      .catch(() => {
        setIsError(true);
      });
  }

  function handleComment(data, e) {
    setPostCommentError('');
    setIsSubmitting(true);
    postData(`${GET_POST_DETAILS}${id}/comment`, data, 'POST', accessToken)
      .then((response) => {
        if (response.body) {
          setCommentSubmitted(commentSubmitted + 1);
          setIsComment(true);

          setTimeout(() => {
            e.target.parentElement.parentElement.scrollIntoView({ block: 'end', inline: 'end' });
          }, 300);
        } else if (response.errors) {
          switch (response.statusCode) {
            case 400:
              setPostCommentError(response.errors[0].message);
              break;
            default:
              setPostCommentError('Something went wrong.. please try again later');
          }
        }
      })
      .catch(() => {
        setPostCommentError('Something went wrong.. please try again later');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
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
        isEmoji || isComment ? setIsLoading(false) : setIsLoading(true);
        setIsError(false);

        const response = await fetch(`${GET_POST_DETAILS}${id}?_author=true&_comments=true&_reactions=true`, options);
        const responseJSON = await response.json();

        if (response.status === 200) {
          setPost(responseJSON);

          if (responseJSON.reactions.length) {
            setReactions(responseJSON.reactions);
          }

          if (responseJSON.comments.length) {
            setComments(responseJSON.comments);
          }
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
  }, [id, accessToken, isEmoji, emoji, commentSubmitted, isComment]);

  if (isError) {
    return (
      <>
        <p>Something went wrong ...</p>
        <p>Please try again later</p>
        <Link to={'/posts'}>Posts page</Link>
      </>
    );
  }

  return (
    <>
      <h1>Post Details</h1>
      <section>
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <>
            <p style={backBtnStyle}>
              To {'>>'} <Link to={'/posts'}>Posts page</Link>
            </p>
            <div className={postStyles}>
              <div>
                <div>
                  <h2>{post.title}</h2>
                  {post.author && (
                    <div className="author">
                      <span>
                        By <span className={'author-name'}>{post.author.name}</span>{' '}
                      </span>
                      {post.author.avatar && (
                        <img
                          className={'avatar-img'}
                          src={post.author.avatar}
                          alt={post.author.name}
                          onError={handleAvatarError}
                        />
                      )}{' '}
                      on {new Date(post.created).toLocaleDateString(undefined, dateOptions)}
                    </div>
                  )}
                </div>
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
                <div className={'reactions'}>
                  {reactions && (
                    <div className={'post-reactions'}>
                      <div>
                        {reactions.map(({ symbol, count }, index) => {
                          return (
                            <span key={index}>
                              {symbol} {count}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  <div className={'react-to-post'}>
                    <button onClick={handleReaction} data-emoji={'❤️'}>
                      ❤️
                    </button>
                    <button onClick={handleReaction} data-emoji={'👌'}>
                      👌
                    </button>
                    <button onClick={handleReaction} data-emoji={'😆'}>
                      😆
                    </button>
                    <button onClick={handleReaction} data-emoji={'😲'}>
                      😲
                    </button>
                    <button onClick={handleReaction} data-emoji={'😞'}>
                      😞
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <img src={post.media} alt={post.title} onError={handleImgError} />
              </div>
            </div>
            <div className={postComments}>
              <h3>Comments</h3>
              <div className={'comments-container'}>
                <div className={'comments'}>
                  {comments.length ? (
                    comments
                      .sort((a, b) => a.id - b.id)
                      .map(({ owner, body, created }, index) => {
                        return (
                          <div className={'comment'} key={index}>
                            <small>
                              <strong>{owner}</strong> on {new Date(created).toLocaleDateString(undefined, dateOptions)}
                            </small>
                            <p>{body}</p>
                          </div>
                        );
                      })
                  ) : (
                    <div className={'no-comment'}>
                      <p>You can be the first to comment ❤️</p>
                    </div>
                  )}
                </div>
                <div className={'post-comment'}>
                  <form onSubmit={handleSubmit(handleComment)}>
                    <h4>
                      <label htmlFor={'body'}>Place a comment</label>
                    </h4>
                    <textarea
                      onKeyDown={() => setPostCommentError('')}
                      {...register('body')}
                      rows={10}
                      name={'body'}
                      placeholder={'Your comment'}
                    ></textarea>
                    {errors.body?.message ? <p>{errors.body?.message}</p> : null}
                    <Button color={'#3f51b5bf'} type={'submit'}>
                      {isSubmitting ? 'Processing ...' : 'Comment'}
                    </Button>
                    {postCommentError && <p>{postCommentError}</p>}
                  </form>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
}

export default PostDetails;
