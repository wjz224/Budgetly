import './App.css'; 
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Dashboard from './components/Dashboard';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import { CookiesProvider } from 'react-cookie'; // Import CookiesProvider
import Error from  './components/Error'
function AppContent() {
  const location = useLocation(); // Get the current route

  return (
    <div className="App">
      {/* Conditionally render Navbar */}
      {(location.pathname === '/register' ||  location.pathname === '/' || location.pathname === '/login') && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Redirect unknown routes to a fallback (e.g., Home or 404 page) */}
        <Route path="*" element={<Error />}/>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <CookiesProvider> {/* Wrap the app in CookiesProvider */}
      <Router>
        <AppContent /> {/* Move useLocation inside the Router context */}
      </Router>
    </CookiesProvider>
  );
}

export default App;
