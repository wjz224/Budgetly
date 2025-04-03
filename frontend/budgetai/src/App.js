
import './App.css'; 
import Home from './components/Home'
import Login from './components/Login'
import Register from './components/Register'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
function App() {

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path = "/login">
            <Login />
          </Route>
          <Route path = "/register">
            <Register />
          </Route>


        </Switch>
      </div>
    </Router>
  );
}

export default App;
