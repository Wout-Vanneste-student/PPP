import React from 'react';
import Onboarding from '../screens/Onboarding';
import Startup from '../screens/Startup';
import Login from '../screens/Login';
import Loadprofile from '../screens/Loadprofile';
import Signuploading from '../screens/Signuploading';
import Signup from '../screens/Signup';
import Profile from '../screens/Profile';
import Extensions from '../screens/Extensions';
// Following screens shouldn't be imported as their components should be rendered as extensions.
// import Weather from '../screens/Weather';
// import Planning from '../screens/Planning';
// import Addplanning from '../screens/Addplanning';
import {Image, StyleSheet, Platform} from 'react-native';

import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

const TabNavigator = createBottomTabNavigator(
  {
    Extensions: {
      screen: Extensions,
      navigationOptions: {
        headerMode: 'none',
        header: null,
        tabBarLabel: 'Extensions',
        tabBarIcon: () => {
          return (
            <Image
              style={styles.tabIcon}
              source={require('../assets/img/icons/extensions.png')}
            />
          );
        },
      },
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        headerMode: 'none',
        header: null,
        tabBarLabel: 'Profile',
        tabBarIcon: () => {
          return (
            <Image
              style={styles.tabIcon}
              source={require('../assets/img/icons/profile.png')}
            />
          );
        },
      },
    },
  },
  {
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeBackgroundColor: '#44234C',
      labelStyle: {
        fontSize: 14,
        padding: 3,
        fontFamily:
          Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
      },
      inactiveBackgroundColor: 'white',
      style: {
        height: 55,
        borderTopWidth: 2,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopColor: '#44234C',
        borderLeftColor: '#44234C',
        borderRightColor: '#44234C',
        backgroundColor: '#44234C',
      },
    },
  },
);

const MainNavigator = createStackNavigator({
  Onboarding: {screen: Onboarding},
  Startup: {screen: Startup},
  Login: {screen: Login},
  Signup: {screen: Signup},
  Profile: {
    screen: TabNavigator,
    navigationOptions: {
      headerMode: 'none',
      header: null,
    },
  },
  Extensions: {
    screen: TabNavigator,
    navigationOptions: {
      headerMode: 'none',
      header: null,
    },
  },
  Loadprofile: {screen: Loadprofile},
  Signuploading: {screen: Signuploading},
  // Weather: {screen: Weather},
  // Planning: {screen: Planning},
  // Addplanning: {screen: Addplanning},
});

const styles = StyleSheet.create({
  tabIcon: {
    width: 35,
    height: 35,
    resizeMode: 'contain',
    margin: 5,
  },
});

const AppContainer = createAppContainer(MainNavigator);

export default AppContainer;
