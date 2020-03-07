import React, { Component } from "react";
import ReactLoading from "react-loading";
import { withRouter } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { appFirestore, appStorage } from "../../firebase.config";
import images from "../../utils/images";
import "./Profile.scss";
import constants from "../../utils/constants";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      id: localStorage.getItem(constants.ID),
      nickname: localStorage.getItem(constants.NICKNAME),
      aboutMe: localStorage.getItem(constants.ABOUT_ME),
      photoUrl: localStorage.getItem(constants.PHOTO_URL)
    };
    this.newAvatar = null;
    this.newPhotoUrl = "";
  }

  componentDidMount() {
    this.checkLogin();
  }

  checkLogin = () => {
    if (!localStorage.getItem(constants.ID)) {
      this.props.history.push("/");
    }
  };

  onChangeNickname = event => {
    this.setState({ nickname: event.target.value });
  };

  onChangeAboutMe = event => {
    this.setState({ aboutMe: event.target.value });
  };

  onChangeAvatar = event => {
    if (event.target.files && event.target.files[0]) {
      // Check this file is an image?
      const prefixFiletype = event.target.files[0].type.toString();
      if (prefixFiletype.indexOf(constants.PREFIX_IMAGE) !== 0) {
        this.props.showToast(0, "This file is not an image");
        return;
      }
      this.newAvatar = event.target.files[0];
      this.setState({ photoUrl: URL.createObjectURL(event.target.files[0]) });
    } else {
      this.props.showToast(0, "Something wrong with input file");
    }
  };

  uploadAvatar = () => {
    this.setState({ isLoading: true });
    if (this.newAvatar) {
      const uploadTask = appStorage
        .ref()
        .child(this.state.id)
        .put(this.newAvatar);
      uploadTask.on(
        constants.UPLOAD_CHANGED,
        null,
        err => {
          this.props.showToast(0, err.message);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.updateUserInfo(true, downloadURL);
          });
        }
      );
    } else {
      this.updateUserInfo(false, null);
    }
  };

  updateUserInfo = (isUpdatePhotoUrl, downloadURL) => {
    let newInfo;
    if (isUpdatePhotoUrl) {
      newInfo = {
        nickname: this.state.nickname,
        aboutMe: this.state.aboutMe,
        photoUrl: downloadURL
      };
    } else {
      newInfo = {
        nickname: this.state.nickname,
        aboutMe: this.state.aboutMe
      };
    }
    appFirestore
      .collection(constants.NODE_USERS)
      .doc(this.state.id)
      .update(newInfo)
      .then(data => {
        localStorage.setItem(constants.NICKNAME, this.state.nickname);
        localStorage.setItem(constants.ABOUT_ME, this.state.aboutMe);
        if (isUpdatePhotoUrl) {
          localStorage.setItem(constants.PHOTO_URL, downloadURL);
        }
        this.setState({ isLoading: false });
        this.props.showToast(1, "Update info success");
      });
  };

  render() {
    return (
      <div className="root">
        <div className="header">
          <span>PROFILE</span>
        </div>

        <img className="avatar" alt="Avatar" src={this.state.photoUrl} />

        <div className="viewWrapInputFile">
          <img
            className="imgInputFile"
            alt="icon gallery"
            src={images.ic_input_file}
            onClick={() => this.refInput.click()}
          />
          <input
            ref={el => {
              this.refInput = el;
            }}
            accept="image/*"
            className="viewInputFile"
            type="file"
            onChange={this.onChangeAvatar}
          />
        </div>

        <span className="textLabel">Nickname:</span>
        <input
          className="textInput"
          value={this.state.nickname ? this.state.nickname : ""}
          placeholder="Your nickname..."
          onChange={this.onChangeNickname}
        />
        <span className="textLabel">About me:</span>
        <input
          className="textInput"
          value={this.state.aboutMe ? this.state.aboutMe : ""}
          placeholder="Tell about yourself..."
          onChange={this.onChangeAboutMe}
        />

        <button className="btnUpdate" onClick={this.uploadAvatar}>
          UPDATE
        </button>

        {this.state.isLoading ? (
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
}

export default withRouter(Profile);
