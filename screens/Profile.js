import React, { Component } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  AsyncStorage,
  Platform,
  StatusBar,
  SafeAreaView
} from "react-native";
import { CounterContainer } from "../plugins/counter";
import firebase from "../config/Firebase";
import * as Font from "expo-font";
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      message: "",
      fontLoaded: false,
      userName: "",
      expoPushToken: ""
    };
  }
  static navigationOptions = {
    header: null,
    headerMode: "none"
  };

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    this.currentUserId = await firebase.getCurrentUserId();
    this.currentUserName = await firebase.getCurrentUserName(
      this.currentUserId
    );
    await Font.loadAsync({
      "Customfont-Regular": require("../assets/fonts/Customfont-Regular.ttf"),
      "Customfont-Italic": require("../assets/fonts/Customfont-Italic.ttf")
    });
    this.setState({ fontLoaded: true });
    try {
      const value = await AsyncStorage.getItem("userName");
      if (value !== null) {
        this.setState({ username: value });
      } else {
        const subThis = JSON.stringify(this.currentUserName);
        const userName = subThis.substring(1, subThis.length - 1);
        this.setState({ username: userName });
        AsyncStorage.setItem("userName", userName);
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  handleSignout = async () => {
    const { navigate } = this.props.navigation;
    firebase
      .signOut()
      .then(AsyncStorage.clear())
      .then(navigate("Startup"));
  };

  render() {
    return this.state.fontLoaded === false ? null : (
      <SafeAreaView style={styles.hideStatusBar}>
        <View>
          <CounterContainer />
        </View>
        <TouchableOpacity
          style={styles.big_button}
          onPress={() => this.handleSignout()}
        >
          <Text style={styles.button_text}>Sign out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 25,
    flex: 1,
    justifyContent: "space-between"
  },
  big_button: {
    borderWidth: 2,
    borderColor: "#44234C",
    borderRadius: 5,
    width: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 10,
    alignSelf: "center"
  },
  button_text: {
    color: "#44234C",
    fontSize: 20,
    fontFamily: "Customfont-Bold"
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
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto"
  }
});

export default Profile;
