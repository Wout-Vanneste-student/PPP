import React, { Component } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Button,
  Platform,
  StatusBar,
  StyleSheet
} from "react-native";
import firebase from "../config/Firebase";

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
  async componentDidMount() {
    this.currentUserId = await firebase.getCurrentUserId();
    this.currentUserName = await firebase.getCurrentUserName(
      this.currentUserId
    );
    const username = (email = JSON.stringify(this.currentUserName).substring(
      1,
      JSON.stringify(this.currentUserName).length - 1
    ));
    this.setState({ username });
  }
  render() {
    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <View>
          <Text>Home page</Text>
        </View>
        <Button title="Profile" onPress={() => navigate("Profile")} />
        <View>
          <Text>Welcome {this.state.username}!</Text>
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
