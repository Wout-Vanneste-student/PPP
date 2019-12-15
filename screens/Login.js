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
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import {Firebase, colors} from '../extensions/wizerCore';

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
      isLoading: false,
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
    this.setState({isLoading: true});
    const {email, password} = this.state;
    try {
      await Firebase.loginWithEmail(email, password);
      const user = await Firebase.getCurrentUser();
      if (user.uid) {
        this.setState({userFound: true});
        const userId = user.uid;
        console.log('useridlogin:', userId);
        AsyncStorage.setItem('currentUserId', JSON.stringify(userId));
      }
    } catch (error) {
      console.log(error);
      this.setState({
        loginError: 'No user found, your email or password was incorrect.',
        canSubmit: false,
      });
    } finally {
      if (this.state.userFound === true) {
        const {navigate} = this.props.navigation;
        navigate('Home');
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
    const {isLoading} = this.state;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        {isLoading ? (
          <>
            <Image
              style={styles.loading_title_image}
              source={require('../assets/img/wizer_dark.png')}
            />
            <ActivityIndicator size="large" color={colors.wizer} />
            <Text style={styles.bottom_text}>
              Wizer is loading your profile {'\n'} just a moment please…
            </Text>
          </>
        ) : (
          <>
            <View style={styles.form}>
              <Image
                style={styles.title_image}
                source={require('../assets/img/wizer_dark.png')}
              />
              <View style={styles.testen}>
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
              <View style={styles.testen}>
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
                <Text style={styles.inputError}>
                  {this.state.passwordError}
                </Text>
              </View>
              <Text style={styles.inputError}>{this.state.loginError}</Text>
            </View>
            <View style={styles.buttonContainer}>
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
            </View>
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  testen: {
    width: '100%',
    margin: 0,
    padding: 0,
  },
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
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.wizer,
    marginTop: 10,
    fontSize: 17.5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  inputHelp: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
    color: '#5B5B5B',
    marginTop: 5,
  },
  inputLabel: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    color: colors.wizer,
    fontSize: 25,
  },
  title_image: {
    width: 150,
    height: 75,
    resizeMode: 'contain',
    paddingTop: 100,
  },
  loading_title_image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    paddingTop: 200,
  },
  big_button: {
    borderWidth: 2,
    borderColor: colors.wizer,
    borderRadius: 5,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7.5,
    paddingBottom: Platform.OS === 'android' ? 12.5 : 7.5,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.2,
  },
  button_text: {
    color: colors.wizer,
    fontSize: 25,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  form: {
    width: '100%',
    paddingHorizontal: 20,
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
  bottom_text: {
    color: colors.wizer,
    fontSize: 17.5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'center',
    paddingHorizontal: 10,
  },
});

export default Login;
