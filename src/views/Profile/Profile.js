import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { appFirestore, appStorage } from "../../firebase.config";
import images from "../../utils/images";
import "./Profile.scss";
import constants from "../../utils/constants";

const Profile = props => {
  const [isLoading, setIsLoading] = useState(false);
  const [id] = useState(localStorage.getItem(constants.ID));
  const [nickname, setNickname] = useState(localStorage.getItem(constants.NICKNAME));
  const [aboutMe, setAboutMe] = useState(localStorage.getItem(constants.ABOUT_ME));
  const [photoUrl, setPhotoUrl] = useState(localStorage.getItem(constants.PHOTO_URL));
  const [newAvatar, setNewAvatar] = useState(null);
  let refInput = null;

  useEffect(() => {
    checkLogin();
  });

  const checkLogin = () => {
    if (!localStorage.getItem(constants.ID)) {
      props.history.push("/");
    }
  };

  const onChangeNickname = event => {
    setNickname(event.target.value);
  };

  const onChangeAboutMe = event => {
    setAboutMe(event.target.value);
  };

  const onChangeAvatar = event => {
    const targetFiles = event.target.files;
    if (targetFiles && targetFiles[0]) {
      // Check this file is an image?
      const prefixFiletype = targetFiles[0].type.toString();
      if (prefixFiletype.indexOf(constants.PREFIX_IMAGE) !== 0) {
        props.showToast(0, "This file is not an image");
        return;
      }
      setNewAvatar(targetFiles[0]);
      setPhotoUrl(URL.createObjectURL(targetFiles[0]));
    } else {
      props.showToast(0, "Something wrong with input file");
    }
  };

  const uploadAvatar = () => {
    setIsLoading(true);
    if (newAvatar) {
      const uploadTask = appStorage
        .ref()
        .child(id)
        .put(newAvatar);
      uploadTask.on(
        constants.UPLOAD_CHANGED,
        null,
        err => {
          props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            updateUserInfo(true, downloadURL);
          });
        }
      );
    } else {
      updateUserInfo(false, null);
    }
  };

  const updateUserInfo = (isUpdatePhotoUrl, downloadURL) => {
    let newInfo;
    if (isUpdatePhotoUrl) {
      newInfo = {
        nickname,
        aboutMe,
        photoUrl: downloadURL
      };
    } else {
      newInfo = {
        nickname,
        aboutMe,
      };
    }
    appFirestore
      .collection(constants.NODE_USERS)
      .doc(id)
      .update(newInfo)
      .then(data => {
        localStorage.setItem(constants.NICKNAME, nickname);
        localStorage.setItem(constants.ABOUT_ME, aboutMe);
        if (isUpdatePhotoUrl) {
          localStorage.setItem(constants.PHOTO_URL, downloadURL);
        }
        setIsLoading(false);
        props.showToast(1, "Update info success");
      });
  };

  return (
    <div className="profile-root">
      <div className="header">
        <div className="left-section">
          <i className="fa fa-chevron-left" onClick={() => props.history.push("/main")}></i>        </div>
        <div className="title-section">
          <span>PROFILE</span>
        </div>
        <div className="right-section">
        </div>

      </div>

      <img className="avatar" alt="Avatar" src={photoUrl} />

      <div className="viewWrapInputFile">
        <img
          className="imgInputFile"
          alt="icon gallery"
          src={images.ic_input_file}
          onClick={() => refInput.click()}
        />
        <input
          ref={el => {
            refInput = el;
          }}
          accept="image/*"
          className="viewInputFile"
          type="file"
          onChange={onChangeAvatar}
        />
      </div>

      <span className="textLabel">Nickname:</span>
      <input
        className="textInput"
        value={nickname ? nickname : ""}
        placeholder="Your nickname..."
        onChange={onChangeNickname}
      />
      <span className="textLabel">About me:</span>
      <input
        className="textInput"
        value={aboutMe ? aboutMe : ""}
        placeholder="Tell about yourself..."
        onChange={onChangeAboutMe}
      />

      <button className="btnUpdate" onClick={uploadAvatar}>
        UPDATE
        </button>

      {
        isLoading ? (
          <div className="viewLoading">
            <ReactLoading
              type={"spin"}
              color={"#203152"}
              height={"3%"}
              width={"3%"}
            />
          </div>
        ) : null
      }
    </div >
  );
}

export default withRouter(Profile);
