import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Screens/Landingpage/HomePage";
import Signup from "./Screens/Accounts/Signup";
import Login from "./Screens/Accounts/Login";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
