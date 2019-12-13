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

import {Firebase} from '../extensions/wizerCore';

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
    this._signUserIn();
  }

  _signUserIn = async () => {
    const storedUsername = await AsyncStorage.getItem('SIGNUP_userName');
    const storedEmail = await AsyncStorage.getItem('SIGNUP_email');
    const storedPassword = await AsyncStorage.getItem('SIGNUP_password');

    this.setState({
      username: storedUsername,
      email: storedEmail,
      password: storedPassword,
    });
    if (
      storedUsername !== null &&
      storedEmail !== null &&
      storedPassword !== null
    ) {
      try {
        const response = await Firebase.signupWithEmail(
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
          await Firebase.createNewUser(userData);
          userData = {username, email, password, uid};
          await Firebase.addUserData(uid, userData);
        }
      } catch (error) {
        console.log(error.message);
      } finally {
        if (this.state.userFound === true) {
          const {navigate} = this.props.navigation;
          AsyncStorage.removeItem('SIGNUP_username');
          AsyncStorage.removeItem('SIGNUP_email');
          AsyncStorage.removeItem('SIGNUP_password');
          navigate('Extensions');
        }
      }
    }
  };

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
