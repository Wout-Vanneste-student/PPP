import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Profile from "../screens/Profile";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

// LOGIN SIGNUP HOME ...
const MainNavigator = createStackNavigator({
  Login: { screen: Login },
  Signup: { screen: Signup },
  Profile: { screen: Profile },
  Home: { screen: Home }
});

const AppContainer = createAppContainer(MainNavigator);

export default AppContainer;
