import React from "react";
import "react-toastify/dist/ReactToastify.css";
import "./WelcomeBoard.scss";

const WelcomeBoard = props => (
  <div className="viewWelcomeBoard">
    <span className="textTitleWelcome">{`Welcome, ${props.currentUserNickname}`}</span>
    <img
      className="avatarWelcome"
      src={props.currentUserAvatar}
      alt="icon avatar"
    />
    <span className="textDesciptionWelcome">
      Let's start talking. Great things might happen.
        </span>
  </div>
);

export default WelcomeBoard;
