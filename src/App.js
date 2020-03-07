import React from "react";
import { Link, BrowserRouter as Router } from "react-router-dom";
import { routes as RouterView } from "./routes";

function App() {
  return (
    <div className="App">
      <Router>
        <Link to="/">Log In</Link>
        <Link to="/main">Main</Link>
        <Link to="/profile">Profile</Link>

        <RouterView />
      </Router>
    </div>
  );
}

export default App;
