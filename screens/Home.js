import React, { Component } from "react";
import { Text, View, Button } from "react-native";
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
      <>
        <View>
          <Text>Home page</Text>
        </View>
        <Button title="Profile" onPress={() => navigate("Profile")} />
        <View>
          <Text>Welcome back {this.state.username}!</Text>
        </View>
      </>
    );
  }
}

export default Home;
