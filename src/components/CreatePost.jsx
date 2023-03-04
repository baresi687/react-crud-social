import { createPostStyles } from './CreatePost.module.scss';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import Button from './Button.jsx';
import { postData } from '../utils/fetchFunctions.js';
import { CREATE_POST_URL } from '../settings/api.js';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup.js';
import { getFromStorage } from '../utils/storage.js';

const schema = yup.object({
  title: yup.string().trim().required('Please enter a title'),
  body: yup.string().trim().required('Please enter a description'),
  media: yup
    .string()
    .trim()
    .required('Please enter an Image URL')
    .matches(/\.(jpg|jpeg|png|webp|avif|gif|svg)$/, 'Image URL is not valid'),
});

function CreatePost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  const [formError, setFormError] = useState(false);
  const [formErrorMsg, setFormErrorMSg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auth, setAuth] = useContext(AuthContext);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();
  const { accessToken } = getFromStorage('userData');

  useEffect(() => {
    if (!accessToken) {
      navigate('/sign-in', { replace: true });
    } else {
      setAuth(accessToken);
    }
  }, [auth, setAuth, accessToken, navigate]);

  function handleTags(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      if (e.currentTarget.value && !tags.includes(e.currentTarget.value) && tags.length <= 8) {
        setTags([...tags, e.currentTarget.value]);
        e.currentTarget.value = '';
      }
    }
  }

  function removeTag(e) {
    setTags([...tags.filter((item) => item !== e.target.innerText)]);
  }

  function onSubmit(data) {
    setIsSubmitting(true);
    setFormError(false);

    data.tags = tags;

    postData(CREATE_POST_URL, data, 'POST', accessToken)
      .then((response) => {
        if (response.id) {
          navigate(`/post-details/${response.id}`);
        } else {
          setFormError(true);
          setFormErrorMSg(response.errors[0].message);
        }
      })
      .catch(() => {
        setFormError(true);
        setFormErrorMSg('Something went wrong.. please try again later');
      })
      .finally(() => setIsSubmitting(false));
  }

  return (
    <>
      <h1>Create Post</h1>
      <form className={createPostStyles} onSubmit={handleSubmit(onSubmit)}>
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
            {isSubmitting ? 'Processing ...' : 'Create Post'}
          </Button>
        </div>
        {formError && <h2>{formErrorMsg}</h2>}
      </form>
    </>
  );
}

export default CreatePost;
