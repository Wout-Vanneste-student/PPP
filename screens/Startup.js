import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import {Firebase, colors} from '../extensions/wizerCore';

import {LoginManager, AccessToken} from 'react-native-fbsdk';

class Startup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showLoading: false,
      userFound: false,
      isLoading: false,
    };
  }
  static navigationOptions = {
    header: null,
  };

  handleLoginWithFacebook = async () => {
    this.setState({isLoading: true});
    let canLogin = false;
    await LoginManager.logInWithPermissions(['email', 'public_profile'])
      .then(
        async function(result) {
          if (result.isCancelled) {
            console.log('Login cancelled');
          } else {
            await AccessToken.getCurrentAccessToken().then(async data => {
              const token = data.accessToken.toString();
              if (token) {
                const fbResult = await Firebase.loginWithFacebook(token);
                if (fbResult) {
                  const displayname = fbResult.user.displayName.split(' ', 1);
                  const email = fbResult.user.email;
                  const uid = fbResult.user.uid;
                  const username = displayname[0];
                  await AsyncStorage.setItem('userName', username);
                  await AsyncStorage.setItem('currentUserId', uid);
                  let userData = {email, uid};
                  await Firebase.createNewUser(userData);
                  userData = {username, email, uid};
                  await Firebase.addUserData(uid, userData);
                }
                await AsyncStorage.setItem('facebookToken', token);
                canLogin = true;
              } else {
              }
            });
          }
        },
        async function(error) {
          console.log('Login fail with error: ' + error);
        },
      )
      .then(() => {
        if (canLogin) {
          const {navigate} = this.props.navigation;
          navigate('Home');
        }
      });
  };

  render() {
    const {navigate} = this.props.navigation;
    const {isLoading} = this.state;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        {isLoading ? (
          <>
            <Image
              style={styles.title_image}
              source={require('../assets/img/wizer_dark.png')}
            />
            <ActivityIndicator size="large" color={colors.wizer} />
            <Text style={styles.bottom_text}>
              Wizer is creating your profile {'\n'} just a moment please…
            </Text>
          </>
        ) : (
          <>
            <Image
              style={styles.title_image}
              source={require('../assets/img/wizer_dark.png')}
            />
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.big_button,
                  styles.login_button,
                  styles.top_button,
                ]}
                onPress={() => navigate('Login')}>
                <Image
                  style={styles.email_icon}
                  source={require('../assets/img/email.png')}
                />
                <Text style={styles.button_text}>Login with email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.facebook_button,
                  styles.big_button,
                  styles.top_button,
                ]}
                onPress={() => this.handleLoginWithFacebook()}>
                <Image
                  style={styles.button_icon}
                  source={require('../assets/img/facebook.png')}
                />
                <Text style={styles.fbgoogle_button_text}>
                  Login with Facebook
                </Text>
              </TouchableOpacity>
              <Text style={styles.noAccount}>No account yet?</Text>
              <TouchableOpacity
                style={styles.signup_button}
                onPress={() => navigate('Signup')}>
                <Text style={styles.signup_button_text}>Sign up</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.bottom_text}>
              Join Wizer and make your planning easier and wiser than ever.
            </Text>
          </>
        )}
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  noAccount: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'center',
    color: colors.wizer,
    fontSize: 17,
    marginBottom: 10,
    marginTop: 20,
  },
  buttonContainer: {
    flex: 1,
    width: '100%',
  },
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 50,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  title_image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    paddingTop: 200,
  },
  bottom_text: {
    color: colors.wizer,
    fontSize: 17.5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  top_button: {
    marginBottom: 25,
  },
  signup_button: {
    borderWidth: 2,
    borderColor: colors.wizer,
    borderRadius: 5,
    alignSelf: 'center',
    width: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: Platform.OS === 'android' ? 9 : 4,
  },
  signup_button_text: {
    color: colors.wizer,
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  login_button: {
    backgroundColor: colors.wizer,
  },
  big_button: {
    borderRadius: 5,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7.5,
    paddingBottom: Platform.OS === 'android' ? 12.5 : 7.5,
    paddingLeft: 15,
    position: 'relative',
  },
  facebook_button: {
    backgroundColor: '#3a559f',
  },
  google_button: {
    backgroundColor: '#f42914',
  },
  button_icon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    position: 'absolute',
    left: 10,
  },
  email_icon: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    position: 'absolute',
    left: 15,
  },
  fbgoogle_button_text: {
    color: 'white',
    fontSize: 25,
    marginTop: 4,
    marginBottom: 1,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
  button_text: {
    color: 'white',
    fontSize: 25,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
});
export default Startup;
