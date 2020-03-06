import React from 'react';
import { Route, BrowserRouter as Router } from 'react-router-dom'

import App from './App';
import Users from './views/Users'

export default (
  <Router>
    <div>
      <Route path="/" component={App} />
      <Route path="/users" component={Users} />
    </div>
  </Router>
)