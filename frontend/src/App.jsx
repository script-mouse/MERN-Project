import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const path = window.location.pathname;

  if (path === '/register') {
    return <Register />;
  }

  return <Login />;
}

export default App;