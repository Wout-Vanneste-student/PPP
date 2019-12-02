import Home from "../screens/Home";
import Onboarding from "../screens/Onboarding";
import Startup from "../screens/Startup";
import Login from "../screens/Login";
import Loadprofile from "../screens/Loadprofile";
import Signuploading from "../screens/Signuploading";
import Signup from "../screens/Signup";
import Profile from "../screens/Profile";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

// LOGIN SIGNUP HOME ...
const MainNavigator = createStackNavigator({
  Onboarding: { screen: Onboarding },
  Startup: { screen: Startup },
  Login: { screen: Login },
  Signup: { screen: Signup },
  Profile: { screen: Profile },
  Home: { screen: Home },
  Loadprofile: { screen: Loadprofile },
  Signuploading: { screen: Signuploading }
});

const AppContainer = createAppContainer(MainNavigator);

export default AppContainer;
