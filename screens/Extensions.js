import React, {Component, Fragment} from 'react';
import {
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';

class Extensions extends Component {
  constructor() {
    super();
  }
  static navigationOptions = {
    header: null,
    headerMode: 'none',
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <Fragment>
        <SafeAreaView style={styles.topBar} />
        <SafeAreaView style={styles.hideStatusBar}>
          <StatusBar barStyle="light-content" />
          <Text style={styles.headerText}>Extensions page</Text>
          <Text style={styles.smallText}>
            Here all the extions will be shown and you'll be able to navigate to
            them
          </Text>
          <TouchableOpacity onPress={() => navigate('Weather')}>
            <Text>Weather</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Planning')}>
            <Text>Planning</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  topBar: {
    flex: 0,
    backgroundColor: '#44234C',
  },
  headerText: {
    fontSize: 25,
    color: '#44234C',
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 75,
    marginTop: 50,
  },
  smallText: {
    fontSize: 15,
    color: '#44234C',
    textAlign: 'center',
    marginHorizontal: 15,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
});

export default Extensions;
