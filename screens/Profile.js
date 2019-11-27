import React, { Component } from "react";
import { Text, View, Button } from "react-native";

import CounterContainer from "../plugins/counter/containers";
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
          <CounterContainer />
        </View>
      </>
    );
  }
}

export default Profile;
