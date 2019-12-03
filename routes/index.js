import React from "React";
import Planning from "../screens/Planning";
import Onboarding from "../screens/Onboarding";
import Startup from "../screens/Startup";
import Login from "../screens/Login";
import Loadprofile from "../screens/Loadprofile";
import Signuploading from "../screens/Signuploading";
import Signup from "../screens/Signup";
import Profile from "../screens/Profile";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";
import { Image, StyleSheet } from "react-native";

const TabNavigator = createBottomTabNavigator(
  {
    Planning: {
      screen: Planning,
      navigationOptions: {
        headerMode: "none",
        header: null,
        tabBarLabel: "Planning",
        tabBarIcon: () => {
          return (
            <Image
              style={styles.tabIcon}
              source={require("../assets/img/calendar.png")}
            ></Image>
          );
        }
      }
    },
    Profile: {
      screen: Profile,
      navigationOptions: {
        headerMode: "none",
        header: null,
        tabBarLabel: "Profile",
        tabBarIcon: () => {
          return (
            <Image
              style={styles.tabIcon}
              source={require("../assets/img/profile.png")}
            ></Image>
          );
        }
      }
    }
  },
  {
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      activeBackgroundColor: "#44234C",
      labelStyle: {
        fontSize: 14,
        padding: 3,
        fontFamily: "Customfont-Regular"
      },
      style: {
        height: 55,
        borderTopWidth: 3,
        borderTopColor: "#44234C"
      }
    }
  }
);

const MainNavigator = createStackNavigator({
  Onboarding: { screen: Onboarding },
  Startup: { screen: Startup },
  Login: { screen: Login },
  Signup: { screen: Signup },
  Profile: {
    screen: TabNavigator
  },
  Planning: {
    screen: TabNavigator,
    navigationOptions: {
      headerMode: "none",
      header: null
    }
  },
  Loadprofile: { screen: Loadprofile },
  Signuploading: { screen: Signuploading }
});

const styles = StyleSheet.create({
  tabIcon: {
    width: 35,
    height: 35,
    resizeMode: "contain",
    margin: 5
  }
});

const AppContainer = createAppContainer(MainNavigator);

export default AppContainer;
