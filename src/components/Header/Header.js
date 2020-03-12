import React, { useState } from 'react'
import './Header.scss';

const Header = props => {
  const [showMoreOptionsMenu, setShowMoreOptionsMenu] = useState(false);
  const isAnonymous = localStorage.getItem('isAnonymously');

  const toggleMoreOptionsMenu = () => {
    setShowMoreOptionsMenu(!showMoreOptionsMenu)
  }

  const goToSourceCode = () => {
    window.location.replace("https://github.com/chrisureza/react-chat");
  }

  return (
    <div className={isAnonymous ? "header anonymous" : "header"}>
      <div className="left-section">
        {props.goBack &&
          <i className="fa fa-chevron-left" onClick={props.goBack}></i>
        }
        {props.toogleChatsView &&
          <span className="fa fa-comments" onClick={props.toogleChatsView}></span>
        }
      </div>
      <div className="title-section">
        <span>{props.title}</span>
      </div>
      <div className="right-section">
        <div className="btns-container">
          {props.onProfileClick &&
            <span className="fa fa-user-circle" onClick={props.onProfileClick}></span>
          }
          {props.onLogoutClick &&
            <span className="fa fa-sign-out" onClick={props.onLogoutClick}></span>
          }
          <span className="fa fa-ellipsis-v" onClick={toggleMoreOptionsMenu}></span>
          {showMoreOptionsMenu &&
            <div className="more-options-container" onClick={toggleMoreOptionsMenu}>
              <div className="more-options-menu">
                <p className="more-options-item" onClick={goToSourceCode}> Source Code </p>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  )
}

export default Header;
