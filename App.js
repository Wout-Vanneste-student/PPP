import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import AppContainer from "./routes";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}
