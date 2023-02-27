import './NavBar.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
import { getFromStorage } from '../utils/storage.js';

function NavBar() {
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();
  const { name } = getFromStorage('userData');

  function setNavItemActive({ isActive }) {
    return {
      textDecoration: isActive ? 'underline 2px' : 'inherit',
    };
  }

  function handleSignOut() {
    setAuth(null);
    localStorage.clear();
    navigate('/signin');
  }

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData) {
      setAuth(userData.accessToken);
    }
  });

  return (
    <header>
      <nav>
        <NavLink to="/" className="logo">
          SocialMedia
        </NavLink>
        <NavLink to="/" style={setNavItemActive}>
          Home
        </NavLink>
        {auth ? (
          <>
            <NavLink to="/posts" style={setNavItemActive}>
              Posts
            </NavLink>
            <NavLink to="/createpost" style={setNavItemActive}>
              Create Post
            </NavLink>
            <NavLink to="/profile" style={setNavItemActive}>
              Profile
            </NavLink>
            {name && <span className="user-name">Hi {name}</span>}
            <Button onClick={handleSignOut}>Sign Out</Button>
          </>
        ) : (
          <>
            <NavLink to="/signup" style={setNavItemActive}>
              Sign Up
            </NavLink>
            <NavLink to="/signin" style={setNavItemActive}>
              Sign In
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default NavBar;
