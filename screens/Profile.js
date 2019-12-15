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

import {Firebase, colors} from '../extensions/wizerCore';

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
    const value = await AsyncStorage.getItem('userName');
    if (value) {
      this.setState({userName: value});
    } else {
      this.currentUserId = await AsyncStorage.getItem('currentUserId');
      if (this.currentUserId === null) {
        this.currentUserId = await Firebase.getCurrentUserId();
      }
      if (this.currentUserId.charAt(0) === '"') {
        this.currentUserId = this.currentUserId.substring(
          1,
          this.currentUserId.length - 1,
        );
      }
      const currentUserName = await Firebase.getCurrentUserName(
        this.currentUserId,
      );
      const subThis = JSON.stringify(currentUserName);
      const userName = subThis.substring(1, subThis.length - 1);
      this.setState({userName: userName});
      await AsyncStorage.setItem('userName', userName);
    }
  };

  handleSignout = async () => {
    const {navigate} = this.props.navigation;
    Firebase.signOut()
      .then(AsyncStorage.clear())
      .then(navigate('Onboarding'));
  };

  render() {
    return (
      <Fragment>
        <SafeAreaView style={styles.topBar} />
        <SafeAreaView style={styles.hideStatusBar}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.headerText}>Hello {this.state.userName}</Text>
          <Text style={styles.didYouKnow}>
            Did you know... {'\n'} {'\n'} "Strengths" is the longest word in the
            English language with one vowel?
          </Text>
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
    backgroundColor: colors.wizer,
  },
  big_button: {
    borderWidth: 2,
    borderColor: colors.wizer,
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
    color: colors.wizer,
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  headerText: {
    fontSize: 25,
    color: colors.wizer,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 75,
    marginTop: 50,
  },

  didYouKnow: {
    fontSize: 17,
    color: colors.wizer,
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
    color: colors.wizer,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  thankDesignerButton: {
    marginBottom: 50,
    borderWidth: 1,
    borderColor: colors.wizer,
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
    color: colors.wizer,
    fontSize: 17,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
});

export default Profile;
