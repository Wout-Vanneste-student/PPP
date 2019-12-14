import React, {Component} from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
import * as firebase from 'firebase';

import {
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const slides = [
  {
    key: 'onboarding1',
    title: 'Wizer planning',
    text: 'Keep track off everything on your planning',
    title_image: require('../assets/img/wizer_white.png'),
    image: require('../assets/img/todo.png'),
    backgroundColor: '#44234C',
  },
];

class Onboarding extends Component {
  constructor() {
    super();
    this.state = {};
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.checkLoggedInUser();
  }

  checkLoggedInUser = async () => {
    const response = await firebase
      .auth()
      .onAuthStateChanged(async function(user) {
        if (user) {
          await AsyncStorage.setItem('currentUserId', user.uid);
          return true;
        } else {
          return false;
        }
      });
    if (response) {
      const {navigate} = this.props.navigation;
      navigate('Home');
    }
  };

  _renderItem = ({item}) => {
    return (
      <View style={styles.onboardingView}>
        <Image style={styles.title_image} source={item.title_image} />
        <Image style={styles.image} source={item.image} />
        <Text style={styles.onboardingText}>{item.text}</Text>
      </View>
    );
  };
  _renderDoneButton = () => {
    return <Text style={[styles.customButton, styles.rightButton]}>Done</Text>;
  };

  _onDone = () => {
    const {navigate} = this.props.navigation;
    navigate('Startup');
  };

  render() {
    return (
      <SafeAreaView style={styles.onboarding}>
        <AppIntroSlider
          showSkipButton
          showPrevButton
          renderDoneButton={this._renderDoneButton}
          renderItem={this._renderItem}
          slides={slides}
          onDone={this._onDone}
          dotStyle={styles.dotstyle}
          activeDotStyle={styles.activedotstyle}
          style={styles.hideStatusBar}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  activedotstyle: {backgroundColor: 'rgba(255, 255, 255, 1)'},
  dotstyle: {backgroundColor: 'rgba(92, 61, 144, 1)'},
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  onboarding: {
    paddingTop: 25,
    paddingBottom: Platform.OS === 'android' ? 0 : 100,
    backgroundColor: '#44234C',
    flex: 1,
  },
  onboardingView: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 100,
  },
  onboardingText: {
    color: 'white',
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  title_image: {
    width: 150,
    height: 75,
    resizeMode: 'contain',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  customButton: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    fontSize: 17.5,
    color: 'white',
    marginTop: 7.5,
  },
  leftButton: {
    marginLeft: 15,
  },
  rightButton: {
    marginRight: 15,
  },
});

export default Onboarding;
