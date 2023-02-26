import './NavBar.scss';
import { NavLink } from 'react-router-dom';
import SignOutBtn from './SignOutBtn.jsx';
function NavBar() {
  const isSignedIn = false;
  function setNavItemActive({ isActive }) {
    return {
      textDecoration: isActive ? 'underline 2px' : 'inherit',
    };
  }

  return (
    <header>
      <nav>
        <NavLink to="/" className="logo">
          SocialMedia
        </NavLink>
        <NavLink to="/" style={setNavItemActive}>
          Home
        </NavLink>
        {isSignedIn ? (
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
            <SignOutBtn />
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
