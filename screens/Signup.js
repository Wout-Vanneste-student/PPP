import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Platform,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {colors} from '../extensions/wizerCore';

class Signup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      password2: '',
      emailError: '',
      passwordError: '',
      password2Error: '',
      emailGood: '',
      passwordGood: '',
      password2Good: '',
      canSubmit: false,
      userFound: false,
      userName: '',
      userNameGood: '',
      userNameError: '',
      hidePassword: true,
      hideRepeatPassword: true,
    };
  }

  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {};

  handleCheckEmail = () => {
    const email = this.state.email;
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(email) === false) {
      this.setState({
        emailError: 'Please enter a valid email address.',
        emailGood: false,
      });
    } else {
      this.setState({emailGood: 'Almost as cool as ours.'});
      if (
        this.state.userNameGood !== '' &&
        this.state.passwordGood !== '' &&
        this.state.password2Good !== ''
      ) {
        this.setState({canSubmit: true});
      } else {
        this.setState({canSubmit: false});
      }
    }
  };

  handleCheckPassword = () => {
    const pwd = this.state.password;
    let hasLowerCase = false;
    let hasUpperCase = false;
    for (var i = 0; i < pwd.length; i++) {
      if (pwd.charAt(i) >= 0 && pwd.charAt(i) <= 9) {
      } else {
        if (pwd.charAt(i) === pwd.charAt(i).toLowerCase()) {
          hasLowerCase = true;
        }
        if (pwd.charAt(i) === pwd.charAt(i).toUpperCase()) {
          hasUpperCase = true;
        }
      }
    }
    if (pwd.length < 6) {
      this.setState({
        passwordError: 'Your password should be at least 6 characters',
        passwordGood: false,
      });
    } else if (!/\d/.test(pwd)) {
      this.setState({
        passwordError: 'Your password should contain a number',
        passwordGood: false,
      });
    } else if (hasLowerCase === false || hasUpperCase === false) {
      this.setState({
        passwordError:
          'Your password should contain uppercase and lowercase letters',
        passwordGood: false,
      });
    } else {
      this.setState({passwordGood: 'Good password!'});
      if (
        this.state.emailGood !== '' &&
        this.state.userNameGood !== '' &&
        this.state.password2Good !== ''
      ) {
        this.setState({canSubmit: true});
      } else {
        this.setState({canSubmit: false});
      }
    }
    if (this.state.password2.length > 0) {
      this.handleBlurPassword2();
    }
  };

  handleCheckPassword2 = () => {
    const {password, password2} = this.state;
    if (password2.length === 0) {
      this.setState({
        password2Error: 'Please fill in your password first',
        password2Good: false,
      });
    } else if (password !== password2) {
      this.setState({
        password2Error: "Your passwords don't match",
        password2Good: false,
      });
    } else {
      this.setState({password2Good: 'Great match'});
      if (
        this.state.emailGood !== '' &&
        this.state.passwordGood !== '' &&
        this.state.userNameGood !== ''
      ) {
        this.setState({canSubmit: true});
      } else {
        this.setState({canSubmit: false});
      }
    }
  };

  handleCheckuserName = () => {
    const name = this.state.userName;
    if (name.length >= 3) {
      this.setState({userNameGood: 'We already like your name'});
      if (
        this.state.emailGood !== '' &&
        this.state.passwordGood !== '' &&
        this.state.password2Good !== ''
      ) {
        this.setState({canSubmit: true});
      } else {
        this.setState({canSubmit: false});
      }
    } else {
      this.setState({
        userNameError: 'Your username should be at least 3 characters long',
      });
    }
  };

  handleSubmit = async () => {
    const {email, password, userName} = this.state;
    AsyncStorage.setItem('SIGNUP_userName', userName);
    AsyncStorage.setItem('SIGNUP_email', email);
    AsyncStorage.setItem('SIGNUP_password', password);
    const {navigate} = this.props.navigation;
    navigate('Signuploading');
  };

  render() {
    return (
      <SafeAreaView style={styles.safeView}>
        <KeyboardAvoidingView
          style={styles.hideStatusBar}
          keyboardVerticalOffset={-500}
          behavior={Platform.OS === 'android' ? 'padding' : 'padding'}
          enabled>
          <ScrollView
            style={styles.scrollview}
            showsVerticalScrollIndicator={false}>
            <View style={styles.form}>
              <Image
                style={styles.title_image}
                source={require('../assets/img/wizer_dark.png')}
              />
              <View style={styles.formItem}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput
                  style={styles.textInput}
                  onEndEditing={() => this.handleCheckuserName()}
                  autoCorrect={false}
                  autoCapitalize="words"
                  value={this.state.userName}
                  onChangeText={userName =>
                    this.setState({userName, userNameError: ''})
                  }
                />
                <Text style={styles.inputHelp}>
                  We'll call you by your username
                </Text>
                <Text
                  style={
                    this.state.userNameError !== ''
                      ? styles.inputError
                      : styles.inputGood
                  }>
                  {this.state.userNameError !== ''
                    ? this.state.userNameError
                    : this.state.userNameGood}
                </Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  onEndEditing={() => this.handleCheckEmail()}
                  keyboardType="email-address"
                  autoCorrect={false}
                  autoCapitalize="none"
                  value={this.state.email}
                  onChangeText={email => this.setState({email, emailError: ''})}
                />
                <Text style={styles.inputHelp}>Example: john@company.com</Text>
                <Text
                  style={
                    this.state.emailError !== ''
                      ? styles.inputError
                      : styles.inputGood
                  }>
                  {this.state.emailError !== ''
                    ? this.state.emailError
                    : this.state.emailGood}
                </Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInput}
                  onEndEditing={() => this.handleCheckPassword()}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry={this.state.hidePassword}
                  value={this.state.password}
                  onChangeText={password =>
                    this.setState({password, passwordError: ''})
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
                <Text
                  style={
                    this.state.passwordError !== ''
                      ? styles.inputError
                      : styles.inputGood
                  }>
                  {this.state.passwordError !== ''
                    ? this.state.passwordError
                    : this.state.passwordGood}
                </Text>
              </View>
              <View style={styles.formItem}>
                <Text style={styles.inputLabel}>Repeat password</Text>
                <TextInput
                  style={styles.textInput}
                  onEndEditing={() => this.handleCheckPassword2()}
                  autoCorrect={false}
                  autoCapitalize="none"
                  secureTextEntry={this.state.hideRepeatPassword}
                  value={this.state.password2}
                  onChangeText={password2 =>
                    this.setState({password2, password2Error: ''})
                  }
                />
                <TouchableOpacity
                  style={styles.hideShowPassword}
                  onPress={() =>
                    this.setState({
                      hideRepeatPassword: !this.state.hideRepeatPassword,
                    })
                  }>
                  <Image
                    source={
                      this.state.hideRepeatPassword
                        ? require('../assets/img/hide.png')
                        : require('../assets/img/show.png')
                    }
                    style={styles.hideShowPasswordImg}
                  />
                </TouchableOpacity>
                <Text style={styles.inputHelp}>
                  Type that again just to make sure
                </Text>
                <Text
                  style={
                    this.state.password2Error !== ''
                      ? styles.inputError
                      : styles.inputGood
                  }>
                  {this.state.password2Error
                    ? this.state.password2Error
                    : this.state.password2Good}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => this.handleSubmit()}
              disabled={this.state.canSubmit ? false : true}
              style={
                this.state.canSubmit
                  ? styles.big_button
                  : {...styles.big_button, ...styles.buttonDisabled}
              }>
              <Text style={styles.button_text}>Sign up</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeView: {flex: 1},
  hideStatusBar: {
    paddingBottom: 50,
    flex: 1,
    marginHorizontal: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scrollview: {
    width: '100%',
    flex: 1,
  },
  formItem: {
    width: '100%',
  },
  inputError: {
    color: 'red',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  inputGood: {
    color: 'green',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: colors.wizer,
    width: '100%',
    marginTop: 10,
    fontSize: 17.5,
    padding: 0,
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
    marginTop: 20,
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
  notLastView: {
    marginBottom: 25,
  },
});

export default Signup;
