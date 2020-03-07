import React from "react";
import { Route, Switch } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

import Login from "./views/Login/Login";
import Main from "./views/Main/Main";
import Profile from "./views/Profile/Profile";

export const routes = () => {
  const showToast = (type, message) => {
    switch (type) {
      case "warning":
        toast.warning(message);
        break;
      case "success":
        toast.success(message);
        break;
      default:
        break;
    }
  };

  return (
    <div>
      <ToastContainer
        autoClose={2000}
        hideProgressBar={true}
        position={toast.POSITION.BOTTOM_RIGHT}
      />
      <Switch>
        <Route
          exact
          path="/"
          render={props => <Login showToast={showToast} {...props} />}
        />
        <Route
          exact
          path="/main"
          render={props => <Main showToast={showToast} {...props} />}
        />
        <Route
          exact
          path="/profile"
          render={props => <Profile showToast={showToast} {...props} />}
        />
      </Switch>
    </div>
  );
};
