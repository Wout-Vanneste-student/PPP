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
  ActivityIndicator,
  View,
} from 'react-native';
import {colors} from '../extensions/wizerCore';

const slides = [
  {
    key: 'onboarding1',
    title: 'Wizer planning',
    text: 'Keep track off everything on your planning',
    title_image: require('../assets/img/wizer_white.png'),
    image: require('../assets/img/todo.png'),
    backgroundColor: colors.wizer,
  },
];

class Onboarding extends Component {
  constructor() {
    super();
    this.state = {
      userLoading: false,
    };
  }
  static navigationOptions = {
    header: null,
  };

  componentDidMount() {
    this.checkLoggedInUser();
  }

  checkLoggedInUser = async () => {
    await firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.setState({userLoading: false});
        const {navigate} = this.props.navigation;
        navigate('Home');
      }
    });
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
    const {userLoading} = this.state;
    return (
      <SafeAreaView
        style={userLoading ? styles.loadingOnboarding : styles.onboarding}>
        {userLoading ? (
          <>
            <Image
              style={styles.title_image}
              source={require('../assets/img/wizer_dark.png')}
            />
            <ActivityIndicator size="large" color={colors.wizer} />
            <Text style={styles.bottom_text}>
              Wizer is loading your profile {'\n'} just a moment please…
            </Text>
          </>
        ) : (
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
        )}
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
    paddingBottom: Platform.OS === 'android' ? 0 : 100,
    backgroundColor: colors.wizer,
    flex: 1,
  },
  loadingOnboarding: {
    paddingTop: 25,
    paddingBottom: 50,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  title_image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    paddingTop: 200,
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

export default Onboarding;
