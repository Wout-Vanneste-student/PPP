import React, {Component, Fragment} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import firebase from '../config/Firebase';

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      message: '',
      userName: '',
      expoPushToken: '',
    };
  }
  static navigationOptions = {
    header: null,
    headerMode: 'none',
  };

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    const currentUserId = await firebase.getCurrentUserId();
    const currentUserName = await firebase.getCurrentUserName(currentUserId);
    const userNameStringify = JSON.stringify(currentUserName);
    const userNameString = userNameStringify.substring(
      1,
      userNameStringify.length - 1,
    );
    this.setState({userName: userNameString});
    try {
      const value = await AsyncStorage.getItem('userName');
      if (value !== null) {
        this.setState({username: value});
      } else {
        const subThis = JSON.stringify(this.currentUserName);
        const userName = subThis.substring(1, subThis.length - 1);
        this.setState({username: userName});
        AsyncStorage.setItem('userName', userName);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  handleSignout = async () => {
    const {navigate} = this.props.navigation;
    firebase
      .signOut()
      .then(AsyncStorage.clear())
      .then(navigate('Startup'));
  };

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.topBar} />
        <SafeAreaView style={styles.hideStatusBar}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.headerText}>Hello {this.state.userName}</Text>
          <TouchableOpacity
            style={styles.big_button}
            onPress={() => this.handleSignout()}>
            <Text style={styles.button_text}>Sign out</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 25,
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0,
    backgroundColor: '#44234C',
  },
  big_button: {
    borderWidth: 2,
    borderColor: '#44234C',
    borderRadius: 5,
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'android' ? 10 : 5,
    alignSelf: 'center',
  },
  button_text: {
    color: '#44234C',
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  item: {
    marginLeft: 0,
    paddingLeft: 0,
    marginRight: 0,
    paddingRight: 0,
  },
  form: {
    marginLeft: 10,
    paddingLeft: 10,
    marginRight: 10,
    paddingRight: 10,
  },
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 'auto',
  },
  headerText: {
    fontSize: 25,
    color: '#44234C',
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 75,
    marginTop: 50,
  },
});

export default Profile;
