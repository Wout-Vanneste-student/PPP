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

class Loadprofile extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      userFound: false
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this._retrieveData();
    this._logUserIn();
  }

  _logUserIn = async () => {
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
        this.handleLogin(email, password);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  handleLogin = async (email, password) => {
    try {
      const response = await firebase.loginWithEmail(email, password);
      if (response.user.uid) {
        this.setState({ userFound: true });
      }
      const userId = response.user.uid;
      AsyncStorage.setItem("userId", JSON.stringify(userId));
    } catch (error) {
      console.log("error: ", error);
    } finally {
      if (this.state.userFound === true) {
        const { navigate } = this.props.navigation;
        navigate("Planning");
      }
    }
  };

  _retrieveData = async () => {
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
          Wizer is loading your profile {"\n"} just a moment please…
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

export default Loadprofile;
