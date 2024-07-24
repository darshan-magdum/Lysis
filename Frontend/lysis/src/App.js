import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Screens/Landingpage/HomePage";
import Signup from "./Screens/Accounts/Signup";
import Login from "./Screens/Accounts/Login";
import ForgotPassword from "./Screens/Accounts/ForgotPassword";
import ResetPassword from "./Screens/Accounts/ResetPassword";
import ManagerDashboard from "./Screens/Dashboard/Manager/ManagerDashboard";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/ForgotPassword" element={<ForgotPassword />} />
          <Route path="/ResetPassword" element={<ResetPassword />} />
          
          <Route path="/ManagerDashboard" element={<ManagerDashboard />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;
