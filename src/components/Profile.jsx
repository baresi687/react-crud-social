import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import { GET_USER_POSTS_URL, EDIT_DELETE_USER_POST } from '../settings/api.js';
import { getFromStorage } from '../utils/storage.js';
import Button from './Button.jsx';
import { profileStyles, editModal } from './Profile.module.scss';
import { postData } from '../utils/fetchFunctions.js';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { useForm } from 'react-hook-form';

const schema = yup.object({
  title: yup.string().trim().required('Please enter a title'),
  body: yup.string().trim().required('Please enter a description'),
  media: yup
    .string()
    .trim()
    .required('Please enter an Image URL')
    .matches(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/, 'Image URL is not valid'),
});

function Profile() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMSg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModal, setIsModal] = useState(false);
  const [tags, setTags] = useState([]);
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

  function handleTags(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (e.currentTarget.value && !tags.includes(e.currentTarget.value) && tags.length <= 8) {
        setTags([...tags, e.currentTarget.value]);
        e.currentTarget.value = '';
      }
    }
  }

  function handleEdit() {
    setIsModal(true);
    console.log('modal');
  }

  function removeTag(e) {
    setTags([...tags.filter((item) => item !== e.target.innerText)]);
  }

  function onSubmit(data) {
    console.log('data');
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
                      <Button color={'darkgoldenrod'} onClick={handleEdit}>
                        Edit
                      </Button>
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
        <div className={`${editModal} ${isModal ? 'toggle-modal' : ''}`}>
          <div className={'modal-container'}>
            <div className={'modal-header'}>
              <div>Edit Post</div>
              <button aria-label={'Close'} onClick={() => setIsModal(false)}>
                X
              </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <h1>Edit post</h1>
              <div>
                <label htmlFor="title">Title</label>
                <input {...register('title')} name="title" placeholder="Title of post" />
                {errors.title ? <p>{errors.title.message}</p> : null}
              </div>
              <div>
                <label htmlFor="body">Description</label>
                <textarea {...register('body')} name="body" placeholder="Description" rows={8} />
                {errors.body ? <p>{errors.body.message}</p> : null}
              </div>
              <div>
                <label htmlFor="media">Image</label>
                <input {...register('media')} name="media" placeholder="Image URL" />
                {errors.media ? <p>{errors.media.message}</p> : null}
              </div>
              <div>
                <label htmlFor="tags">
                  Tags: <small className={'tag-desc'}>Type in tag and hit enter to add tags</small>
                </label>
                <div>
                  <input id={'tags'} onKeyDown={handleTags} name="tags" placeholder="Tags (Optional)" />
                  <div className={'tags'}>
                    {tags.map((tag, index) => (
                      <Button type={'button'} key={index} title="Remove tag" onClick={(e) => removeTag(e)}>
                        {tag}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <Button type="submit" color="#3f51b5bf">
                  {isSubmitting ? 'Processing ...' : 'Edit Post'}
                </Button>
              </div>
              {formError && <h2>{formErrorMsg}</h2>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
