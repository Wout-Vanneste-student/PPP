import React, { Component } from "react";
import { Text, View, Button } from "react-native";
import { connect } from "react-redux";

import CounterComponent from "../containers/CounterComponent";
class Profile extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        <View>
          <Text>Profile page</Text>
          <Button title="Home" onPress={() => navigate("Home")} />
          <CounterComponent />
        </View>
      </>
    );
  }
}

export default Profile;
