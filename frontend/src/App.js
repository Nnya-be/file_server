import './App.css';
import FileNotFound from './components/FileNotFound';
import HomePage from './components/HomePage';
import PageNotFound from './components/PageNotFound';
import SignIn from './components/SignIn';
import SignUp from './components/Signup';
import SendEmail from './components/SubsPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={HomePage}></Route>
        <Route path="/login" Component={SignIn}></Route>
        <Route path="/signup" Component={SignUp}></Route>
        <Route path="/not-found" Component={FileNotFound}></Route>
        <Route path='/subs' Component={SendEmail}></Route>
        <Route path="*" Component={PageNotFound}></Route>
      </Routes>
    </Router>
  );
}

export default App;
