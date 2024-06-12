import './App.css';
import FileNotFound from './components/FileNotFound';
import HomePage from './components/HomePage';
import PageNotFound from './components/PageNotFound';
import SignIn from './components/SignIn';
import SignUp from './components/Signup';
import SendEmail from './components/SubsPage';
import Dashboard from './components/AdminLanding';
import Info from './components/Info';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UploadForm from './components/Upload';
import VerifyAccountPage from './components/VerifyAccountPage';
import ForgetPasswordPage from './components/ForgotPasswordPage';
import ResetPasswordPage from './components/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" Component={HomePage}></Route>
        <Route path="/login" Component={SignIn}></Route>
        <Route path="/signup" Component={SignUp}></Route>
        <Route path="/not-found" Component={FileNotFound}></Route>
        <Route path="/file" Component={SendEmail}></Route>
        <Route path="/admin" Component={Dashboard}></Route>
        <Route path="upload/" element={<UploadForm />}></Route>
        <Route path="/info" Component={Info}></Route>
        <Route path="/verify/*" Component={VerifyAccountPage}></Route>
        <Route path="/forgot-password" Component={ForgetPasswordPage}></Route>
        <Route path="/reset/*" Component={ResetPasswordPage}></Route>
        <Route path="*" Component={PageNotFound}></Route>
      </Routes>
    </Router>
  );
}

export default App;
