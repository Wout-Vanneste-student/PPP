import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  SafeAreaView
} from "react-native";
import { Container, Form, Input, Item, Button, Label } from "native-base";
import firebase from "../config/Firebase";
import _ from "lodash";
import Loader from "./loader";

/* This is to hide warnings about setting a timer */
// YellowBox.ignoreWarnings(["Setting a timer"]);
// const _console = _.clone(console);
// console.warn = message => {
//   if (message.indexOf("Setting a timer") <= -1) {
//     _console.warn(message);
//   }
// };
/* End code to hide warnings about timer */

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      password2: "",
      emailError: "",
      passwordError: "",
      password2Error: "",
      emailGood: false,
      passwordGood: false,
      password2Good: false,
      canSubmit: false,
      showLoading: false,
      userFound: false,
      userName: "",
      userNameGood: false,
      userNameError: ""
    };
  }

  static navigationOptions = {
    header: null
  };

  handleBlurEmail = () => {
    const email = this.state.email;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      this.setState({
        emailError: "Please enter a valid email address.",
        emailGood: false
      });
    } else {
      this.setState({ emailGood: true });
      if (
        this.state.userNameGood === true &&
        this.state.passwordGood === true &&
        this.state.password2Good === true
      ) {
        this.setState({ canSubmit: true });
      } else {
        this.setState({ canSubmit: false });
      }
    }
  };

  handleBlurPassword = () => {
    const pwd = this.state.password;
    let hasLowerCase = false;
    let hasUpperCase = false;
    for (var i = 0; i < pwd.length; i++) {
      if (pwd.charAt(i) >= 0 && pwd.charAt(i) <= 9) {
      } else {
        if (pwd.charAt(i) === pwd.charAt(i).toLowerCase()) {
          hasLowerCase = true;
        }
        if (pwd.charAt(i) === pwd.charAt(i).toUpperCase()) {
          hasUpperCase = true;
        }
      }
    }
    if (pwd.length < 6) {
      this.setState({
        passwordError: "Your password should be at least 6 characters",
        passwordGood: false
      });
    } else if (!/\d/.test(pwd)) {
      this.setState({
        passwordError: "Your password should contain a number",
        passwordGood: false
      });
    } else if (hasLowerCase === false || hasUpperCase === false) {
      this.setState({
        passwordError:
          "Your password should contain uppercase and lowercase letters",
        passwordGood: false
      });
    } else {
      this.setState({ passwordGood: true });
      if (
        this.state.emailGood === true &&
        this.state.userNameGood === true &&
        this.state.password2Good === true
      ) {
        this.setState({ canSubmit: true });
      } else {
        this.setState({ canSubmit: false });
      }
    }
    if (this.state.password2.length > 0) {
      this.handleBlurPassword2();
    }
  };

  handleBlurPassword2 = () => {
    const { password, password2 } = this.state;
    if (password != password2) {
      this.setState({
        password2Error: "Your passwords don't match",
        password2Good: false
      });
    } else {
      this.setState({ password2Good: true });
      if (
        this.state.emailGood === true &&
        this.state.passwordGood === true &&
        this.state.userNameGood === true
      ) {
        this.setState({ canSubmit: true });
      } else {
        this.setState({ canSubmit: false });
      }
    }
  };

  handleBluruserName = () => {
    const name = this.state.userName;
    if (name.length >= 3) {
      this.setState({ userNameGood: true });
      if (
        this.state.emailGood === true &&
        this.state.passwordGood === true &&
        this.state.password2Good === true
      ) {
        this.setState({ canSubmit: true });
      } else {
        this.setState({ canSubmit: false });
      }
    } else {
      this.setState({
        userNameError: "Your username should be at least 3 characters long"
      });
    }
  };

  handleSubmit = async (email, password) => {
    this.handleBluruserName();
    this.handleBlurPassword();
    this.handleBlurPassword2();
    this.handleBlurEmail();
    const {
      emailError,
      passwordError,
      password2Error,
      userNameError
    } = this.state;
    if (
      emailError === "" &&
      passwordError === "" &&
      password2Error === "" &&
      userNameError === ""
    ) {
      this.setState({ showLoading: true });
      try {
        const response = await firebase.signupWithEmail(email, password);
        if (response.user.uid) {
          this.setState({ userFound: true });
          const { uid } = response.user;
          const username = this.state.userName;
          let userData = { email, password, uid };
          await firebase.createNewUser(userData);
          userData = { username, email, password, uid };
          await firebase.addUserData(uid, userData);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        if (this.state.userFound === true) {
          this.setState({ showLoading: false });
          const { navigate } = this.props.navigation;
          navigate("Home");
        }
      }
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <Form style={styles.form}>
          <Item
            style={styles.item}
            error={this.state.userNameError.length > 0 ? true : false}
            success={this.state.userNameGood === true ? true : false}
            floatingLabel
          >
            <Label style={styles.label}>Username</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={userName =>
                this.setState({ userName, userNameError: "" })
              }
              onBlur={this.handleBluruserName}
            ></Input>
          </Item>
          <Text style={styles.error}>{this.state.userNameError}</Text>
          <Item
            style={styles.item}
            error={this.state.emailError.length > 0 ? true : false}
            success={this.state.emailGood === true ? true : false}
            floatingLabel
          >
            <Label style={styles.label}>Email</Label>
            <Input
              autoCorrect={false}
              autoCapitalize="none"
              onChangeText={email => this.setState({ email, emailError: "" })}
              keyboardType="email-address"
              onBlur={this.handleBlurEmail}
            ></Input>
          </Item>
          <Text style={styles.error}>{this.state.emailError}</Text>
          <Item
            style={styles.item}
            floatingLabel
            iconRight
            error={this.state.passwordError.length > 0 ? true : false}
            success={this.state.passwordGood === true ? true : false}
          >
            <Label style={styles.label}>Password</Label>
            <Input
              autoCorrect={false}
              secureTextEntry={true}
              autoCapitalize="none"
              onChangeText={password =>
                this.setState({ password, passwordError: "" })
              }
              onBlur={this.handleBlurPassword}
            ></Input>
          </Item>
          <Text style={styles.error}>{this.state.passwordError}</Text>
          <Item
            style={styles.item}
            floatingLabel
            iconRight
            error={this.state.password2Error.length > 0 ? true : false}
            success={this.state.password2Good === true ? true : false}
          >
            <Label style={styles.label}>Repeat password</Label>
            <Input
              autoCorrect={false}
              secureTextEntry={true}
              autoCapitalize="none"
              onChangeText={password2 =>
                this.setState({ password2, password2Error: "" })
              }
              onBlur={this.handleBlurPassword2}
            ></Input>
          </Item>
          <Text style={styles.error}>{this.state.password2Error}</Text>
        </Form>
        <View>
          <Loader loading={this.state.showLoading === true ? true : false} />
        </View>
        <Button
          style={styles.submit}
          full
          rounded
          onPress={() => navigate("Login")}
        >
          <Text>Already an account? Login</Text>
        </Button>
        <Button
          full
          rounded
          disabled={this.state.canSubmit === true ? false : true}
          onPress={() =>
            this.handleSubmit(this.state.email, this.state.password)
          }
        >
          <Text>Sign up!</Text>
        </Button>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  error: {
    margin: 0,
    padding: 0,
    color: "red",
    marginTop: 5
  },
  item: {
    marginLeft: 0,
    paddingLeft: 0,
    marginRight: 0,
    paddingRight: 0
  },
  form: {
    marginLeft: 10,
    paddingLeft: 10,
    marginRight: 10,
    paddingRight: 10
  },
  submit: {
    backgroundColor: "yellow"
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto"
  }
});

export default Signup;
