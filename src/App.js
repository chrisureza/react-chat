import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { routes as RouterView } from "./routes";

const App = () => {
  return (
    <div className="App">
      <Router>
        <RouterView />
      </Router>
    </div>
  );
};

export default App;
