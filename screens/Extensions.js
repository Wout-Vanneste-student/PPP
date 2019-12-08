import React, {Component} from 'react';
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

  componentDidMount() {
    console.log('did mount');
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <Text style={styles.headerText}>Extensions page</Text>
        <Text style={styles.smallText}>
          Here all the extions will be shown and you'll be able to navigate to
          them
        </Text>
        <TouchableOpacity onPress={() => navigate('Login')}>
          <Text>Planning</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  headerText: {
    fontSize: 25,
    color: '#44234C',
    textAlign: 'center',
    fontFamily: 'Customfont-Regular',
    marginBottom: 75,
    marginTop: 50,
  },
  smallText: {
    fontSize: 15,
    color: '#44234C',
    textAlign: 'center',
    marginHorizontal: 15,
    fontFamily: 'Customfont-Regular',
  },
});

export default Extensions;
