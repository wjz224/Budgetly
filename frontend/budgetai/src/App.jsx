import './App.css'; 
import Home from './components/Home'; // Corrected path
import Login from './components/Authentication/Login'; // Corrected path
import Register from './components/Authentication/Register'; // Corrected path
import Navbar from './components/Web/Navbar'; // Corrected path
import Main from './components/Main';
import Dashboard from './components/Dashboard';
import BudgetPage from './components/BudgetPage';
import CreateBudget from './components/Budgets/CreateBudget'; // Corrected path
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';
import Error from './components/Error';
import { useAuth, AuthProvider } from './components/Authentication/utils/AuthContext'; // Corrected path
import ProtectedRoute from './components/Authentication/utils/ProtectedRoute'; // Corrected path

function AppContent() {
  const location = useLocation(); // Get the current route
  const { user, accessToken } = useAuth(); // Access the accessToken from AuthContext

  return (
    <div className="App">
      {/* Conditionally render Navbar */}
      {(user || !accessToken) && (location.pathname === '/register' || location.pathname === '/' || location.pathname === '/login') && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/main" element={<Main />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/budgets" element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />
        <Route path="/createBudget" element={<ProtectedRoute><CreateBudget /></ProtectedRoute>} />
        {/* Redirect unknown routes to a fallback (e.g., Home or 404 page) */}
        <Route path="*" element={<Error />} />
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
