import React, {Component} from 'react';
import AppContainer from './routes';
import {YellowBox} from 'react-native';

import 'react-native-gesture-handler';

YellowBox.ignoreWarnings(
  ['Warning: Async Storage has been extracted from react-native core'],
  ['Warning: Setting a timer for a long period of time'],
);

class App extends Component {
  render() {
    return <AppContainer />;
  }
}

export default App;
