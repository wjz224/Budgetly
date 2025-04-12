
import './App.css'; 
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import Main from './components/Main'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { CookiesProvider } from 'react-cookie'; // Import CookiesProvider

function App() {
  return (
    <CookiesProvider> {/* Wrap the app in CookiesProvider */}
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/main" element={<Main />} />
          </Routes>
        </div>
      </Router>
    </CookiesProvider>
  );
}

export default App;
