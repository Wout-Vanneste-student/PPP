import React, { Component } from "react";
import {
  Text,
  View,
  Button,
  StyleSheet,
  AsyncStorage,
  Platform,
  StatusBar,
  SafeAreaView
} from "react-native";
import { CounterContainer } from "../plugins/counter";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import firebase from "../config/Firebase";
import * as Font from "expo-font";
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      message: "",
      fontLoaded: false
    };
  }
  static navigationOptions = {
    header: null,
    headerMode: "none"
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }
    try {
      // Get the token that uniquely identifies this device
      this.currentUserToken = await Notifications.getExpoPushTokenAsync();

      firebase.addPushToken(this.currentUserToken, this.currentUserId);
    } catch (error) {
      console.log(error);
    }
  };

  componentDidMount() {
    this._retrieveData();
  }

  _retrieveData = async () => {
    this.currentUserId = await firebase.getCurrentUserId();
    this.currentUserName = await firebase.getCurrentUserName(
      this.currentUserId
    );
    await this.registerForPushNotificationsAsync();
    await Font.loadAsync({
      "Customfont-Regular": require("../assets/fonts/Customfont-Regular.ttf"),
      "Customfont-Italic": require("../assets/fonts/Customfont-Italic.ttf")
    });
    this.setState({ fontLoaded: true });
  };

  sendNotification = () => {
    const { title, message } = this.state;
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        to: this.currentUserToken,
        sound: "default",
        title: title,
        body: message
      })
    });
  };

  handleSignout = async () => {
    const { navigate } = this.props.navigation;
    firebase
      .signOut()
      .then(AsyncStorage.clear())
      .then(navigate("Startup"));
  };

  render() {
    const { navigate } = this.props.navigation;
    return this.state.fontLoaded === false ? null : (
      <SafeAreaView style={styles.hideStatusBar}>
        <View>
          <Text>Profile page</Text>
          <Button title="Planning" onPress={() => navigate("Planning")} />
          <CounterContainer />
          <Button
            title="send notification"
            onPress={() => this.sendNotification("penis", "is dik")}
          />
        </View>
        <Button title="Log out" onPress={() => this.handleSignout()}></Button>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
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
