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

class Loadprofile extends Component {
  constructor() {
    super();
    this.state = {
      userFound: false,
      dataFound: false,
    };
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.retrieveData();
    this._logUserIn();
  }

  _logUserIn = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if (value !== null) {
        var currentId = value.substring(1, value.length - 1);
        this.currentUserId = currentId;
        const currentUser = await firebase.getCurrentUserWithId(currentId);
        let email, password, currentData;
        currentUser.forEach(data => {
          switch (data.key) {
            case 'email':
              currentData = JSON.stringify(data);
              email = currentData.substring(1, currentData.length - 1);
              break;
            case 'password':
              currentData = JSON.stringify(data);
              password = currentData.substring(1, currentData.length - 1);
              break;
          }
        });
        this.handleLogin(email, password);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  handleLogin = async (email, password) => {
    try {
      const response = await firebase.loginWithEmail(email, password);
      if (response.user.uid) {
        this.setState({userFound: true});
      }
      const userId = response.user.uid;
      AsyncStorage.setItem('userId', JSON.stringify(userId));
    } catch (error) {
      console.log('error: ', error);
    } finally {
      if (this.state.userFound === true) {
        this.loadUserdata();
      }
    }
  };

  loadUserdata = async () => {
    const dataList = [];
    const data = await firebase.getPlanningUser(this.currentUserId);
    data.forEach(item => {
      const key = item.key;
      const itemStringify = JSON.stringify(item);
      const itemArray = JSON.parse(itemStringify);
      const time = itemArray.notifDate;
      const title = itemArray.notifMessage;
      const toAddItem = {key, time, title};
      dataList.push(toAddItem);
    });
    AsyncStorage.setItem('userPlanning', JSON.stringify(dataList));
    this.setState({dataFound: true});
    if (this.state.userFound === true && this.state.dataFound === true) {
      const {navigate} = this.props.navigation;
      navigate('Extensions');
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
          Wizer is loading your profile {'\n'} just a moment please…
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
    fontFamily: 'Customfont-Regular',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default Loadprofile;
