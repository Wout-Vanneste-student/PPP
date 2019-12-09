import React, {Component} from 'react';
import {
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
  Image,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from '../config/Firebase';

class Signuploading extends Component {
  constructor() {
    super();
    this.state = {
      userFound: false,
      username: '',
      email: '',
      password: '',
    };
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.retrieveData();
    this._signUserIn();
  }

  _signUserIn = async () => {
    const storedUsername = await AsyncStorage.getItem('SIGNUP_storedUserName');
    const storedEmail = await AsyncStorage.getItem('SIGNUP_storedEmail');
    const storedPassword = await AsyncStorage.getItem('SIGNUP_storedPassword');
    this.setState({storedUsername, storedEmail, storedPassword});
    if (
      storedUsername !== null &&
      storedEmail !== null &&
      storedPassword !== null
    ) {
      try {
        const response = await firebase.signupWithEmail(
          storedEmail,
          storedPassword,
        );
        if (response.user.uid) {
          this.setState({userFound: true});
          const {uid} = response.user;
          const {username, email, password} = this.state;
          let userData = {email, password, uid};
          const userId = response.user.uid;
          AsyncStorage.setItem('userId', JSON.stringify(userId));
          AsyncStorage.setItem('userName', username);
          await firebase.createNewUser(userData);
          userData = {username, email, password, uid};
          await firebase.addUserData(uid, userData);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        if (this.state.userFound === true) {
          const {navigate} = this.props.navigation;
          AsyncStorage.removeItem('SIGNUP_username');
          AsyncStorage.removeItem('SIGNUP_email');
          AsyncStorage.removeItem('SIGNUP_password');
          navigate('Planning');
        }
      }
    }
  };

  retrieveData = async () => {};

  render() {
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <Image
          style={styles.title_image}
          source={require('../assets/img/wizer_dark.png')}
        />
        <ActivityIndicator size="large" color="#44234C" />
        <Text style={styles.bottom_text}>
          Wizer is creating your profile {'\n'} just a moment please…
        </Text>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 50,
  },
  title_image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    paddingTop: 200,
  },
  bottom_text: {
    color: '#44234C',
    fontSize: 17.5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default Signuploading;
