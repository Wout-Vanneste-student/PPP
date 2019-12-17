import React, {Component} from 'react';
import AppContainer from './routes';

import FlashMessage from 'react-native-flash-message';
import 'react-native-gesture-handler';
console.ignoredYellowBox = [
  'Warning: Each',
  'Warning: Failed',
  "Warning: Can't",
];
class App extends Component {
  render() {
    return (
      <>
        <AppContainer />
        <FlashMessage position="top" />
      </>
    );
  }
}

export default App;
