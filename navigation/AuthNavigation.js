import { createStackNavigator } from "react-navigation-stack";
import Login from "../screens/Login";
import Register from "../screens/Register";
const AuthNavigation = createStackNavigator(
  {
    Login: { screen: Login },
    Register: { screen: Register }
  },
  {
    initialRouteName: "Login",
    headerMode: "none"
  }
);
export default AuthNavigation;
