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
    this._logUserIn();
  }

  _logUserIn = async () => {
    const fbUser = await AsyncStorage.getItem('facebookToken');
    if (fbUser) {
      await Firebase.loginWithFacebook(fbUser);
      this.currentUserId = await Firebase.getCurrentUserId();
      this.setState({userFound: true});
      this.loadUserdata();
    }
    try {
      const value = await AsyncStorage.getItem('userId');
      if (value !== null) {
        var currentId = value.substring(1, value.length - 1);
        this.currentUserId = currentId;
        const currentUser = await Firebase.getCurrentUserWithId(currentId);
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
      const response = await Firebase.loginWithEmail(email, password);
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
    const pastList = [];
    const data = await Firebase.getPlanningUser(this.currentUserId);
    let removeList = [];
    data.forEach(item => {
      const key = item.key;
      const itemStringify = JSON.stringify(item);
      const itemArray = JSON.parse(itemStringify);
      const notificationMessage = itemArray.notifMessage;
      const notificationDate = itemArray.notifDate;
      const notificationKey = itemArray.notifKey;
      const notifDateString = JSON.stringify(notificationDate);
      const dateDay = notifDateString.substring(1, 3);
      const dateMonth = notifDateString.substring(4, 6);
      const dateYear = notifDateString.substring(7, 11);
      const dateHours = notifDateString.substring(15, 17);
      const dateMinutes = notifDateString.substring(18, 20);
      const dateFormat = dateYear + '/' + dateMonth + '/' + dateDay;
      let checkDate = new Date(dateFormat);
      checkDate.setSeconds(0);
      checkDate.setMinutes(dateMinutes);
      checkDate.setHours(dateHours);
      const toAddItem = {
        key,
        notificationMessage,
        notificationDate,
        notificationKey,
      };
      if (new Date().getTime() > checkDate.getTime() + 500) {
        removeList.push(toAddItem);
      } else {
        dataList.push(toAddItem);
      }
    });
    const pastData = await Firebase.getPastPlanningUser(this.currentUserId);
    pastData.forEach(pastItem => {
      const pastKey = pastItem.key;
      const pastItemString = JSON.stringify(pastItem);
      const pastItemArray = JSON.parse(pastItemString);
      const pastMessage = pastItemArray.pastItemMessage;
      const pastDate = pastItemArray.pastItemDate;
      const toAddPastItem = {
        pastKey,
        pastMessage,
        pastDate,
      };
      pastList.push(toAddPastItem);
    });
    const currentUserId = await Firebase.getCurrentUserId();
    removeList.forEach(async item => {
      const pastItemMessage = item.notificationMessage;
      const pastItemDate = item.notificationDate;
      const pastItem = {pastItemMessage, pastItemDate};
      await Firebase.addPastItem(currentUserId, pastItem);
      await Firebase.removePlanningItem(currentUserId, item.key);
    });
    await AsyncStorage.setItem('userPlanning', JSON.stringify(dataList));
    await AsyncStorage.setItem('pastPlanning', JSON.stringify(pastList));
    this.setState({dataFound: true});
    if (this.state.userFound === true && this.state.dataFound === true) {
      const {navigate} = this.props.navigation;
      navigate('Extensions');
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
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});

export default Loadprofile;
