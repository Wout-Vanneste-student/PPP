import React, { Component } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Button,
  Platform,
  StatusBar,
  StyleSheet,
  AsyncStorage
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import firebase from "../config/Firebase";
import Firebase from "../config/Firebase";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      username: ""
    };
  }
  static navigationOptions = {
    header: null
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    try {
      this.currentUserToken = await Notifications.getExpoPushTokenAsync();
      this.currentUserId = await Firebase.getCurrentUserId();

      firebase.addPushToken(this.currentUserToken, this.currentUserId);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  async componentDidMount() {
    this._retrieveData();
    await this.registerForPushNotificationsAsync();
  }

  _retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("userName");
      if (value !== null) {
        this.setState({ username: value });
      }
    } catch (error) {
      console.log("error: ", error);
    }
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <View>
          <Text>Home page</Text>
        </View>
        <Button title="Profile" onPress={() => navigate("Profile")} />
        <View>
          <Text>Hi {this.state.username}, enjoy this day!</Text>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  }
});

export default Home;
