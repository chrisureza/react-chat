import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { withRouter } from "react-router-dom";
import { appFirebase, appFirestore } from "../../firebase.config";
import images from "../../utils/images";
import WelcomeBoard from "../../components/WelcomeBoard/WelcomeBoard";
import "./Main.scss";
import ChatBoard from "../../components/ChatBoard/ChatBoard";
import constants from "../../utils/constants";

const Main = props => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [currentPeerUser, setCurrentPeerUser] = useState(null);

  useEffect(() => {
    checkLogin();
  });

  const currentUserId = localStorage.getItem(constants.ID);
  const currentUserAvatar = localStorage.getItem(constants.PHOTO_URL);
  const currentUserNickname = localStorage.getItem(constants.NICKNAME);
  let listUser = [];

  const checkLogin = () => {
    if (!localStorage.getItem(constants.ID)) {
      setIsLoading(false);
      props.history.push("/");
    } else {
      getListUser();
    }
  };

  const getListUser = async () => {
    const result = await appFirestore.collection(constants.NODE_USERS).get();
    if (result.docs.length > 0) {
      listUser = [...result.docs];
      setIsLoading(false);
    }
  };

  const onLogoutClick = () => {
    setIsLogoutDialogOpen(true);
  };

  const doLogout = () => {
    setIsLoading(true);
    appFirebase
      .auth()
      .signOut()
      .then(() => {
        setIsLoading(false);
        localStorage.clear();
        props.showToast(1, "Logout success");
        props.history.push("/");
      })
      .catch(function(err) {
        setIsLoading(false);
        props.showToast(0, err.message);
      });
  };

  const hideLogoutDialog = () => {
    setIsLogoutDialogOpen(false);
  };

  const onProfileClick = () => {
    props.history.push("/profile");
  };

  const renderListUser = () => {
    if (listUser.length > 0) {
      let viewListUser = [];
      listUser.forEach((item, index) => {
        if (item.data().id !== currentUserId) {
          viewListUser.push(
            <button
              key={index}
              className={
                currentPeerUser && currentPeerUser.id === item.data().id
                  ? "viewWrapItemFocused"
                  : "viewWrapItem"
              }
              onClick={() => {
                setCurrentPeerUser(item.data());
              }}
            >
              <img
                className="viewAvatarItem"
                src={item.data().photoUrl}
                alt="icon avatar"
              />
              <div className="viewWrapContentItem">
                <span className="textItem">{`Nickname: ${
                  item.data().nickname
                }`}</span>
                <span className="textItem">{`About me: ${
                  item.data().aboutMe ? item.data().aboutMe : "Not available"
                }`}</span>
              </div>
            </button>
          );
        }
      });
      return viewListUser;
    } else {
      return null;
    }
  };

  const renderLogoutDialog = () => {
    return (
      <div>
        <div className="viewWrapTextLogoutDialog">
          <span className="titleLogoutDialog">Are you sure to logout?</span>
        </div>
        <div className="viewWrapButtonLogoutDialog">
          <button className="btnYes" onClick={doLogout}>
            YES
          </button>
          <button className="btnNo" onClick={hideLogoutDialog}>
            CANCEL
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="root">
      {/* Header */}
      <div className="header">
        <span>MAIN</span>
        <img
          className="icProfile"
          alt="An icon default avatar"
          src={images.ic_default_avatar}
          onClick={onProfileClick}
        />
        <img
          className="icLogout"
          alt="An icon logout"
          src={images.ic_logout}
          onClick={onLogoutClick}
        />
      </div>

      {/* Body */}
      <div className="body">
        <div className="viewListUser"> {renderListUser()}</div>
        <div className="viewBoard">
          {currentPeerUser ? (
            <ChatBoard
              currentPeerUser={currentPeerUser}
              showToast={props.showToast}
            />
          ) : (
            <WelcomeBoard
              currentUserNickname={currentUserNickname}
              currentUserAvatar={currentUserAvatar}
            />
          )}
        </div>
      </div>

      {/* Dialog confirm */}
      {isLogoutDialogOpen ? (
        <div className="viewCoverScreen">{renderLogoutDialog()}</div>
      ) : null}

      {/* Loading */}
      {isLoading ? (
        <div className="viewLoading">
          <ReactLoading
            type={"spin"}
            color={"#203152"}
            height={"3%"}
            width={"3%"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default withRouter(Main);
