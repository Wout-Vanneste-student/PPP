import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from '../config/Firebase';

class Login extends Component {
  constructor() {
    super();
    this.state = {
      userFound: false,
      canSubmit: false,
      email: '',
      password: '',
      loginError: '',
      emailError: '',
      passwordError: '',
      isEmailError: true,
      isPasswordError: true,
      hidePassword: true,
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {};

  handleLogin = async () => {
    const {email, password} = this.state;
    try {
      const response = await firebase.loginWithEmail(email, password);
      if (response.user.uid) {
        this.setState({userFound: true});
      }
      const userId = response.user.uid;
      AsyncStorage.setItem('userId', JSON.stringify(userId));
    } catch (error) {
      /*
      Currently the error message gets shown to the user
      maybe I will change this to custom messages in the future
      */
      console.log(error);
      this.setState({
        loginError: 'No user found, your email or password was incorrect.',
        canSubmit: false,
      });
    } finally {
      if (this.state.userFound === true) {
        const {navigate} = this.props.navigation;
        navigate('Loadprofile');
      }
    }
  };

  handleCheckEmail = () => {
    const email = this.state.email;
    if (this.state.email.length === 0) {
      this.setState({
        canSubmit: false,
        emailError: 'Please enter your email address.',
      });
    } else {
      let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (reg.test(email) === true) {
        this.setState({isEmailError: false});
        if (
          this.state.passwordError === '' &&
          this.state.isPasswordError === false
        ) {
          this.setState({canSubmit: true});
        } else {
          this.setState({canSubmit: false});
        }
      } else {
        this.setState({
          canSubmit: false,
          emailError: 'Please enter a valid email address.',
        });
      }
    }
  };

  handleCheckPassword = () => {
    if (this.state.password.length === 0) {
      this.setState({
        canSubmit: false,
        passwordError: 'Please enter your password.',
      });
      // eslint-disable-next-line yoda
    } else if (6 > this.state.password.length > 0) {
      this.setState({
        canSubmit: false,
        passwordError: 'Please enter a valid password.',
      });
    } else {
      this.setState({isPasswordError: false});
      if (this.state.emailError === '' && this.state.isEmailError === false) {
        this.setState({canSubmit: true});
      } else {
        this.setState({canSubmit: false});
      }
    }
  };

  render() {
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <View style={styles.form}>
          <Image
            style={styles.title_image}
            source={require('../assets/img/wizer_dark.png')}
          />
          <View>
            <Text style={styles.inputLabel}>Email</Text>
            <TextInput
              style={styles.textInput}
              onEndEditing={() => this.handleCheckEmail()}
              keyboardType="email-address"
              autoCorrect={false}
              autoCapitalize="none"
              value={this.state.email}
              onChangeText={email =>
                this.setState({email, emailError: '', loginError: ''})
              }
            />
            <Text style={styles.inputHelp}>Example: john@company.com</Text>
            <Text style={styles.inputError}>{this.state.emailError}</Text>
          </View>
          <View>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              style={styles.textInput}
              onEndEditing={() => this.handleCheckPassword()}
              secureTextEntry={this.state.hidePassword}
              autoCorrect={false}
              autoCapitalize="none"
              value={this.state.password}
              onChangeText={password =>
                this.setState({password, passwordError: '', loginError: ''})
              }
            />
            <TouchableOpacity
              style={styles.hideShowPassword}
              onPress={() =>
                this.setState({hidePassword: !this.state.hidePassword})
              }>
              <Image
                source={
                  this.state.hidePassword
                    ? require('../assets/img/hide.png')
                    : require('../assets/img/show.png')
                }
                style={styles.hideShowPasswordImg}
              />
            </TouchableOpacity>
            <Text style={styles.inputHelp}>
              6+ character, capitals and numbers required
            </Text>
            <Text style={styles.inputError}>{this.state.passwordError}</Text>
          </View>
          <Text style={styles.inputError}>{this.state.loginError}</Text>
        </View>
        <TouchableOpacity
          style={
            this.state.canSubmit
              ? styles.big_button
              : {...styles.big_button, ...styles.buttonDisabled}
          }
          onPress={() => this.handleLogin()}
          disabled={this.state.canSubmit ? false : true}>
          <Text style={styles.button_text}>Login</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 50,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputError: {
    color: 'red',
    fontFamily: 'Customfont-Regular',
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#44234C',
    width: 300,
    marginTop: 10,
    fontSize: 17.5,
    fontFamily: 'Customfont-Regular',
  },
  inputHelp: {
    fontFamily: 'Customfont-Italic',
    color: '#5B5B5B',
    marginTop: 5,
  },
  inputLabel: {
    fontFamily: 'Customfont-Regular',
    color: '#44234C',
    fontSize: 25,
  },
  title_image: {
    width: 150,
    height: 75,
    resizeMode: 'contain',
    paddingTop: 100,
  },
  big_button: {
    borderWidth: 2,
    borderColor: '#44234C',
    borderRadius: 5,
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7.5,
    paddingBottom: 12.5,
  },
  buttonDisabled: {
    opacity: 0.2,
  },
  button_text: {
    color: '#44234C',
    fontSize: 25,
    fontFamily: 'Customfont-Bold',
  },
  form: {
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hideShowPassword: {
    position: 'absolute',
    right: 3,
    bottom: 50,
    height: 40,
    width: 35,
    padding: 2,
  },
  hideShowPasswordImg: {
    resizeMode: 'contain',
    height: '100%',
    width: '100%',
  },
  cannotSubmit: {
    opacity: 0.25,
  },
  canSubmit: {
    opacity: 1,
  },
});

export default Login;
