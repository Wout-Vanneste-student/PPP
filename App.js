import React, {Component} from 'react';
import AppContainer from './routes';
import {YellowBox} from 'react-native';

import 'react-native-gesture-handler';

YellowBox.ignoreWarnings([
  "Warning: Can't perform a React state update on an unmounted component",
]);

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;
