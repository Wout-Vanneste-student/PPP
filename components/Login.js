import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  YellowBox,
  View,
  TouchableHighlight
} from "react-native";
import { Container, Form, Input, Item, Button, Label } from "native-base";
import firebase from "../config/Firebase";
import _ from "lodash";
import Loader from "../components/loader";

/* This is to hide warnings about setting a timer */
YellowBox.ignoreWarnings(["Setting a timer"]);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf("Setting a timer") <= -1) {
    _console.warn(message);
  }
};
/* End code to hide warnings about timer */

class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loginError: "",
      canSubmit: false,
      userFound: false,
      showLoading: false
    };
  }

  static navigationOptions = {
    header: null
  };

  handleLogin = async () => {
    this.setState({ showLoading: true });
    const { email, password } = this.state;
    try {
      const response = await firebase.loginWithEmail(email, password);
      if (response.user.uid) {
        this.setState({ userFound: true });
      }
    } catch (error) {
      /*
      Currently the error message gets shown to the user
      maybe I will change this to custom messages in the future
      */
      this.setState({
        loginError: error.message,
        showLoading: false,
        canSubmit: false
      });
    } finally {
      if (this.state.userFound === true) {
        this.setState({ showLoading: false });
        const { navigate } = this.props.navigation;
        navigate("Home");
      }
    }
  };

  handleBlur = () => {
    if (this.state.email.length > 0 && this.state.password.length > 0) {
      this.setState({ canSubmit: true });
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        <Container>
          <Form style={styles.form}>
            <Item style={styles.item} floatingLabel>
              <Label style={styles.label}>Email</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={email => this.setState({ email })}
                keyboardType="email-address"
                onBlur={this.handleBlur}
              ></Input>
            </Item>
            <Item style={styles.item} floatingLabel iconRight>
              <Label style={styles.label}>Password</Label>
              <Input
                autoCorrect={false}
                secureTextEntry={true}
                autoCapitalize="none"
                onChangeText={password => this.setState({ password })}
                onBlur={this.handleBlur}
              ></Input>
            </Item>
            <Text style={styles.error}>{this.state.loginError}</Text>
          </Form>
          <View>
            <Loader loading={this.state.showLoading} />
          </View>
        </Container>
        <Button
          style={styles.submit}
          full
          rounded
          onPress={() => navigate("Signup")}
        >
          <Text>No account yet? Signup</Text>
        </Button>
        <Button
          full
          rounded
          disabled={this.state.canSubmit === true ? false : true}
          onPress={() => this.handleLogin()}
        >
          <Text>Log in</Text>
        </Button>
      </>
    );
  }
}

const styles = StyleSheet.create({
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
  }
});

export default Login;
