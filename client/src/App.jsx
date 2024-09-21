import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import { useSelector } from "react-redux";
import './App.css'
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from './components/Home';
import HomeForm from "./components/Resume/BuildForm"
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Navbar from "./components/Navbar.jsx";
import ShowResume from "./components/Resume/ShowResume";

function App() {
  const isAuthenticated = useSelector((state) => state.User.isAuthenticated);
  return (
    
    <div>
      <Navbar isAuthenticated = {isAuthenticated}/>
      <div className="h-[100vh] flex justify-center items-center bg-black">
    <Routes>
    <Route path="/signin" element={<SignIn />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} >
            <HomeForm/>
          </ProtectedRoute>
    } />
    <Route path="/forgotpassword" element={<ForgotPassword/>} />
    <Route path="/reset-password/:token" element={<ResetPassword/>} />
    <Route path="/resumes" element={
          <ProtectedRoute isAuthenticated={isAuthenticated} >
            <ShowResume/>
          </ProtectedRoute>
    } />
    </Routes>
    </div>
  </div>
    
  );
}

export default App;
