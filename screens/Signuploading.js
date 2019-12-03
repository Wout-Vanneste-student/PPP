import React, { Component } from "react";
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Text,
  AsyncStorage
} from "react-native";
import firebase from "../config/Firebase";
import * as Font from "expo-font";

class Signuploading extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      userFound: false,
      username: "",
      email: "",
      password: ""
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.retrieveData();
    this._signUserIn();
  }

  _signUserIn = async () => {
    const username = await AsyncStorage.getItem("SIGNUP_userName");
    const email = await AsyncStorage.getItem("SIGNUP_email");
    const password = await AsyncStorage.getItem("SIGNUP_password");
    this.setState({ username, email, password });
    if (username !== null && email !== null && password !== null) {
      try {
        const response = await firebase.signupWithEmail(email, password);
        if (response.user.uid) {
          this.setState({ userFound: true });
          const { uid } = response.user;
          const { username, email, password } = this.state;
          let userData = { email, password, uid };
          const userId = response.user.uid;
          AsyncStorage.setItem("userId", JSON.stringify(userId));
          AsyncStorage.setItem("userName", username);
          await firebase.createNewUser(userData);
          userData = { username, email, password, uid };
          await firebase.addUserData(uid, userData);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        if (this.state.userFound === true) {
          const { navigate } = this.props.navigation;
          AsyncStorage.removeItem("SIGNUP_username");
          AsyncStorage.removeItem("SIGNUP_email");
          AsyncStorage.removeItem("SIGNUP_password");
          navigate("Planning");
        }
      }
    }
  };

  retrieveData = async () => {
    await Font.loadAsync({
      "Customfont-Regular": require("../assets/fonts/Customfont-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  };

  render() {
    return this.state.fontLoaded === false ? null : (
      <SafeAreaView style={styles.hideStatusBar}>
        <Image
          style={styles.title_image}
          source={require("../assets/img/wizer_dark.png")}
        ></Image>
        <ActivityIndicator size="large" color="#44234C"></ActivityIndicator>
        <Text style={styles.bottom_text}>
          Wizer is creating your profile {"\n"} just a moment please…
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 50
  },
  title_image: {
    width: 250,
    height: 150,
    resizeMode: "contain",
    paddingTop: 200
  },
  bottom_text: {
    color: "#44234C",
    fontSize: 17.5,
    fontFamily: "Customfont-Regular",
    textAlign: "center",
    paddingHorizontal: 30
  }
});

export default Signuploading;
