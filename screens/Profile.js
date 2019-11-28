import React, { Component } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { CounterContainer } from "../plugins/counter";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import firebase from "../config/Firebase";

import { Form, Input, Container, Label, Item } from "native-base";
class Profile extends Component {
  constructor() {
    super();
    this.state = {
      title: "",
      message: ""
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

  async componentDidMount() {
    this.currentUserId = await firebase.getCurrentUserId();
    this.currentUserName = await firebase.getCurrentUserName(
      this.currentUserId
    );
    await this.registerForPushNotificationsAsync();
  }

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

  render() {
    const { navigate } = this.props.navigation;
    return (
      <>
        <Container>
          <View>
            <Text>Profile page</Text>
            <Button title="Home" onPress={() => navigate("Home")} />
            <CounterContainer />

            <Button
              title="send notification"
              onPress={() => this.sendNotification("penis", "is dik")}
            />
          </View>
          <Form style={styles.form}>
            <Item style={styles.item} floatingLabel>
              <Label style={styles.label}>Title</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={title => this.setState({ title })}
              ></Input>
            </Item>
            <Item floatingLabel>
              <Label>Message</Label>
              <Input
                autoCorrect={false}
                autoCapitalize="none"
                onChangeText={message => this.setState({ message })}
              ></Input>
            </Item>
          </Form>
        </Container>
      </>
    );
  }
}

const styles = StyleSheet.create({
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
