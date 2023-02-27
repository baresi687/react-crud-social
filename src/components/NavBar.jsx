import './NavBar.scss';
import { NavLink, useNavigate } from 'react-router-dom';
import Button from './Button.jsx';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext.jsx';
function NavBar() {
  const [auth, setAuth] = useContext(AuthContext);
  const navigate = useNavigate();

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
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      setAuth(token);
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
