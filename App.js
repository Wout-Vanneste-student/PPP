import React, { Component } from "react";
import { Provider } from "react-redux";
import store from "./store";
import AppContainer from "./routes";
class App extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    );
  }
}

export default App;
