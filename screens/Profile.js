import React, {Component, Fragment} from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  Linking,
  View,
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
          <View>
            <Text style={styles.thankDesigner}>
              I have to thank the illustrator that provided the free to use
              illustrations
            </Text>
            <TouchableOpacity
              style={styles.thankDesignerButton}
              onPress={() => {
                Linking.openURL('https://www.freepik.com/slidesgo');
              }}>
              <Text style={styles.thankDesignerButtonText}>Illustrator</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.big_button}
              onPress={() => this.handleSignout()}>
              <Text style={styles.button_text}>Sign out</Text>
            </TouchableOpacity>
          </View>
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
    marginHorizontal: 20,
  },
  topBar: {
    flex: 0,
    backgroundColor: '#44234C',
  },
  big_button: {
    borderWidth: 2,
    borderColor: '#44234C',
    borderRadius: 5,
    width: '100%',
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
  headerText: {
    fontSize: 25,
    color: '#44234C',
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 75,
    marginTop: 50,
  },
  thankDesigner: {
    fontSize: 15,
    width: '85%',
    alignSelf: 'center',
    marginBottom: 15,
    color: '#44234C',
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  thankDesignerButton: {
    marginBottom: 50,
    borderWidth: 1,
    borderColor: '#44234C',
    borderRadius: 5,
    width: '80%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'android' ? 10 : 5,
    alignSelf: 'center',
  },
  thankDesignerButtonText: {
    color: '#44234C',
    fontSize: 17,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
});

export default Profile;
