import './App.scss';
import NavBar from './components/NavBar.jsx';
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
      <footer></footer>
    </>
  );
}

export default App;
