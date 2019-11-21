import React, { Component } from "react";
import { Text, View, Button } from "react-native";

class Home extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        <View>
          <Text>Home page</Text>
        </View>
        <Button title="Profile" onPress={() => navigate("Profile")} />
      </>
    );
  }
}

export default Home;
