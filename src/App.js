import React from 'react';
import { Link } from 'react-router-dom'
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">

        <Link to="/users">Users</Link>
      </header>
    </div>
  );
}

export default App;
