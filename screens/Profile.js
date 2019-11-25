import React, { Component } from "react";
import { Text, View, Button } from "react-native";

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
        </View>
        <Button title="Home" onPress={() => navigate("Home")} />
      </>
    );
  }
}

export default Profile;
