import firebase from "firebase";
import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { appFirebase, appFirestore } from "../../firebase.config";
import "./Login.scss";
import constants from "../../utils/constants";
import images from "../../utils/images";

const Login = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkLogin();
  });

  const provider = new firebase.auth.GoogleAuthProvider();

  const checkLogin = () => {
    if (localStorage.getItem(constants.ID)) {
      setIsLoading(false);
      props.showToast(1, "Login success");
      props.history.push("/main");
    } else {
      setIsLoading(false);
    }
  };

  const onAnonymouslyLoginPress = () => {
    setIsLoading(true);
    appFirebase
      .auth()
      .signInAnonymously()
      .then(async result => {
        let user = result.user;
        if (user) {
          const result = await appFirestore
            .collection(constants.NODE_USERS)
            .where(constants.ID, "==", user.uid)
            .get();

          if (result.docs.length === 0) {
            // Set new data since this is a new user
            appFirestore
              .collection("users")
              .doc(user.uid)
              .set({
                id: user.uid,
                nickname: "Anonymous",
                aboutMe: "This is an anonymous account",
                photoUrl: images.ic_default_avatar
              })
              .then(data => {
                // Write user info to local
                localStorage.setItem(constants.ID, user.uid);
                localStorage.setItem(constants.NICKNAME, "Anonymous");
                localStorage.setItem(constants.PHOTO_URL, images.ic_default_avatar);
                setIsLoading(false);
                props.showToast(1, "Login success");
                props.history.push("/main");
              });
          } else {
            // Write user info to local
            localStorage.setItem(constants.ID, result.docs[0].data().id);
            localStorage.setItem(
              constants.NICKNAME,
              result.docs[0].data().nickname
            );
            localStorage.setItem(
              constants.PHOTO_URL,
              result.docs[0].data().photoUrl
            );
            localStorage.setItem(
              constants.ABOUT_ME,
              result.docs[0].data().aboutMe
            );
            setIsLoading(false)
            props.showToast(1, "Login success");
            props.history.push("/main");
          }
          localStorage.setItem('isAnonymously', true);
        } else {
          props.showToast(0, "User info not available");
        }
      })
      .catch((err) => {
        props.showToast(0, err.message);
        setIsLoading(false);
      });
  }

  const onGoogleLoginPress = () => {
    setIsLoading(true);
    appFirebase
      .auth()
      .signInWithPopup(provider)
      .then(async result => {
        let user = result.user;
        if (user) {
          const result = await appFirestore
            .collection(constants.NODE_USERS)
            .where(constants.ID, "==", user.uid)
            .get();

          if (result.docs.length === 0) {
            // Set new data since this is a new user
            appFirestore
              .collection("users")
              .doc(user.uid)
              .set({
                id: user.uid,
                nickname: user.displayName,
                aboutMe: "",
                photoUrl: user.photoURL
              })
              .then(data => {
                // Write user info to local
                localStorage.setItem(constants.ID, user.uid);
                localStorage.setItem(constants.NICKNAME, user.displayName);
                localStorage.setItem(constants.PHOTO_URL, user.photoURL);
                setIsLoading(false);
                props.showToast(1, "Login success");
                props.history.push("/main");
              });
          } else {
            // Write user info to local
            localStorage.setItem(constants.ID, result.docs[0].data().id);
            localStorage.setItem(
              constants.NICKNAME,
              result.docs[0].data().nickname
            );
            localStorage.setItem(
              constants.PHOTO_URL,
              result.docs[0].data().photoUrl
            );
            localStorage.setItem(
              constants.ABOUT_ME,
              result.docs[0].data().aboutMe
            );
            setIsLoading(false)
            props.showToast(1, "Login success");
            props.history.push("/main");
          }
        } else {
          props.showToast(0, "User info not available");
        }
      })
      .catch(err => {
        props.showToast(0, err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="login-viewRoot">
      <div className="header">REACT CHAT DEMO</div>
      <div className="login-btns-containers">
        <button className="btnLogin btnLogin--anonymously" type="submit" onClick={onAnonymouslyLoginPress}>
          SIGN IN ANONYMOUSLY
        </button>
        <button className="btnLogin btnLogin--google" type="submit" onClick={onGoogleLoginPress}>
          SIGN IN WITH GOOGLE
        </button>
      </div>

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
}

export default withRouter(Login);
