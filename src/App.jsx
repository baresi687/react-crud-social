import './sass/index.scss';
import NavBar from './components/NavBar.jsx';
import { Outlet } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import { useState } from 'react';

function App() {
  const [auth, setAuth] = useState(null);
  return (
    <>
      <AuthContext.Provider value={[auth, setAuth]}>
        <NavBar />
        <main>
          <Outlet />
        </main>
        <footer></footer>
      </AuthContext.Provider>
    </>
  );
}

export default App;
