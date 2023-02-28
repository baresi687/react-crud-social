import { Link, useRouteError } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Oh no!</h1>
      <p>Something went wrong ...</p>
      <p>
        <i>Error Message: {error.statusText || error.message}</i>
        <div style={{ margin: '1rem 0' }}>
          <Link to="/">Home</Link>
        </div>
      </p>
    </div>
  );
}
