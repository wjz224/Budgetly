import './App.css'; 
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Dashboard from './components/Dashboard';
import BudgetPage from './components/BudgetPage';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom'; // Import useLocation
import { CookiesProvider } from 'react-cookie'; // Import CookiesProvider
import Error from  './components/Error'
import {useAuth, AuthProvider} from './components/AuthContext'; // Import useAuth
import ProtectedRoute from "./utils/ProtectedRoute"; 


function AppContent() {
  const location = useLocation(); // Get the current route
  const {user, accessToken} = useAuth(); // Access the accessToken from AuthContext

  return (
    <div className="App">
      {/* Conditionally render Navbar */}
        {(user || !accessToken) && (location.pathname === '/register' ||  location.pathname === '/' || location.pathname === '/login') && <Navbar />}
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/main" element={<Main />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/budgets" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
          {/* Redirect unknown routes to a fallback (e.g., Home or 404 page) */}
          <Route path="*" element={<Error />}/>
        </Routes> 
     
    </div>
  );
}

function App() {
  return (
    <CookiesProvider> {/* Wrap the app in CookiesProvider */}
      <AuthProvider>
        <Router>
          <AppContent /> {/* Move useLocation inside the Router context */}
        </Router>
      </AuthProvider>
    </CookiesProvider>
  );
}

export default App;
