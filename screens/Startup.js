import React, { Component } from "react";
import {
  Text,
  SafeAreaView,
  Button,
  AsyncStorage,
  StyleSheet,
  Platform,
  StatusBar
} from "react-native";
import firebase from "../config/Firebase";
import Loader from "./loader";

class Startup extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      showLoading: false,
      userFound: false
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
      const userId = response.user.uid;
      AsyncStorage.setItem("userId", JSON.stringify(userId));
    } catch (error) {
      console.log(error);
      this.setState({ showLoading: false });
    } finally {
      if (this.state.userFound === true) {
        this.setState({ showLoading: false });
        const { navigate } = this.props.navigation;
        navigate("Home");
      }
    }
  };

  componentDidMount() {
    this._retrieveData();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("userId");
      if (value !== null) {
        var currentId = value.substring(1, value.length - 1);
        const currentUser = await firebase.getCurrentUserWithId(currentId);
        let email, password, currentData;
        currentUser.forEach(data => {
          switch (data.key) {
            case "email":
              currentData = JSON.stringify(data);
              email = currentData.substring(1, currentData.length - 1);
              break;
            case "password":
              currentData = JSON.stringify(data);
              password = currentData.substring(1, currentData.length - 1);
              break;
          }
        });
        this.setState({ email, password });
        this.handleLogin();
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <Loader loading={this.state.showLoading} />
        <Text>Personify - Personal assistant</Text>
        <Button
          full
          title="login with email"
          onPress={() => navigate("Login")}
        ></Button>
        <Button
          full
          title="login with facebook"
          onPress={() => navigate("Login")}
        ></Button>
        <Button
          full
          title="login with google"
          onPress={() => navigate("Login")}
        ></Button>
        <Text>
          If you are still logged in, you will automaticaly be forwarded to the
          app.
        </Text>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});
export default Startup;
