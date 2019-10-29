import React, { Component } from "react";
import ErrorMessage from "../components/ErrorMessage";
import firebase from "../Firebase";
import BackButton from "../components/BackButton/BackButton";
import StartScreen from "./StartScreen";

class SignUpScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fullname: "",
      email: "",
      password: "",
      repeatpassword: "",
      errorMessage: null,
      userSignedUp: false,
      goBack: false
    };

    //binding functions
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const itemName = e.target.name;
    const itemValue = e.target.value;

    this.setState({ [itemName]: itemValue }, () => {
      if (this.state.password !== this.state.repeatpassword) {
        this.setState({ errorMessage: "Passwords do not match" });
      } else {
        this.setState({ errorMessage: null });
      }
    });
  }

  handleSubmit(e) {
    let signUpCredentials = {
      fullname: this.state.fullname,
      email: this.state.email,
      password: this.state.password
    };
    e.preventDefault();
    firebase
      .auth()
      .createUserWithEmailAndPassword(
        signUpCredentials.email,
        signUpCredentials.password
      )
      .then(() => {
        this.props.registerUser(signUpCredentials.fullname);
      })
      .catch(error => {
        if (error.message !== null) {
          this.setState({ errorMessage: error.message });
        } else {
          this.setState({ errorMessage: null });
        }
      });
    this.setState({ userSignedUp: true });
  }

  handleBackClick = () => {
    this.setState({ goBack: true });
  };

  render() {
    if (this.state.userSignedUp === true) {
      return (
        <p>
          User {this.state.fullname} with email {this.state.email} has now
          created an account!
        </p>
      );
    }
    if (this.state.goBack === true) {
      return <StartScreen />;
    }
    return (
      <div className="main-container">
        <div className="form-container">
          <form onSubmit={this.handleSubmit}>
            {this.state.errorMessage !== null ? (
              <ErrorMessage message={this.state.errorMessage} />
            ) : null}
            <input
              type="text"
              name="fullname"
              required
              placeholder="fullname"
              value={this.state.fullname}
              onChange={this.handleChange}
            ></input>
            <input
              type="text"
              name="email"
              required
              placeholder="email"
              value={this.state.email}
              onChange={this.handleChange}
            ></input>
            <input
              type="password"
              name="password"
              required
              placeholder="password"
              value={this.state.password}
              onChange={this.handleChange}
            ></input>
            <input
              type="password"
              name="repeatpassword"
              required
              placeholder="repeat-password"
              value={this.state.repeatpassword}
              onChange={this.handleChange}
            ></input>
            <button value="button">go!</button>
          </form>
          <BackButton onClick={this.handleBackClick} />
        </div>
      </div>
    );
  }
}

export default SignUpScreen;