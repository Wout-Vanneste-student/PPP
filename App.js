import { StackNavigator } from "react-navigation";
import Home from "./screens/Home";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Profile from "./screens/Profile";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { store } from "./store";

const MainNavigator = StackNavigator({
  Login: { screen: Login },
  Signup: { screen: Signup },
  Home: { screen: Home },
  Profile: { screen: Profile }
});

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MainNavigator />
      </Provider>
    );
  }
}

export default App;
