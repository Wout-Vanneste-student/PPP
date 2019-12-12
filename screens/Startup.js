import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  View,
  AsyncStorage,
  TouchableOpacity,
} from 'react-native';
// import Firebase from '../config/Firebase';
import {Firebase} from '../extensions/wizerCore';

import {LoginManager, AccessToken} from 'react-native-fbsdk';
import {GoogleSignin} from '@react-native-community/google-signin';

class Startup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      showLoading: false,
      userFound: false,
    };
  }
  static navigationOptions = {
    header: null,
  };

  handleLoginWithFacebook = async () => {
    await LoginManager.logInWithPermissions(['email', 'public_profile']).then(
      function(result) {
        if (result.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(async data => {
            const token = data.accessToken.toString();
            if (token) {
              await Firebase.loginWithFacebook(token);
              await AsyncStorage.setItem('facebookToken', token);
            }
          });
        }
      },
      function(error) {
        console.log('Login fail with error: ' + error);
      },
    );
    const {navigate} = this.props.navigation;
    navigate('Loadprofile');
  };

  handleLoginWithGoogle = async () => {
    console.log('google');
    // Google login not yet working
    // GoogleSignin.configure({
    //   webClientId:
    //     '233359428361-0cmb49b5u902pupo91kcmfri8g23u3a4.apps.googleusercontent.com',
    //   iosClientId:
    //     '233359428361-r23p31il8a2dbqhja6o8jilo3nnd5l0o.apps.googleusercontent.com',
    // });
    // GoogleSignin.signIn()
    //   .then(result => {
    //     console.log('result: ', result);
    //   })
    //   .catch(error => {
    //     console.log('error: ', error);
    //   });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <Image
          style={styles.title_image}
          source={require('../assets/img/wizer_dark.png')}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.big_button, styles.login_button, styles.top_button]}
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
            <Text style={styles.fbgoogle_button_text}>Login with Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.google_button, styles.big_button, styles.top_button]}
            onPress={() => this.handleLoginWithGoogle()}>
            <Image
              style={styles.button_icon}
              source={require('../assets/img/google.png')}
            />
            <Text style={styles.fbgoogle_button_text}>Login with Google</Text>
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
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  noAccount: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'center',
    color: '#44234C',
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
    color: '#44234C',
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
    borderColor: '#44234C',
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
    color: '#44234C',
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  login_button: {
    backgroundColor: '#44234C',
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
