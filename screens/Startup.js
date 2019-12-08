import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  Platform,
  StatusBar,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

class Startup extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      showLoading: false,
      userFound: false,
    };
  }
  static navigationOptions = {
    header: null,
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <Image
          style={styles.title_image}
          source={require('../assets/img/wizer_dark.png')}
        />
        <View>
          <TouchableOpacity
            style={[styles.big_button, styles.top_button]}
            onPress={() => navigate('Login')}>
            <Text style={styles.button_text}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.big_button}
            onPress={() => navigate('Signup')}>
            <Text style={styles.button_text}>Sign up</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.bottom_text}>
          Join Wizer and make your planning easier and wiser than ever
        </Text>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 50,
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title_image: {
    width: 250,
    height: 150,
    resizeMode: 'contain',
    paddingTop: 200,
  },
  bottom_text: {
    color: '#44234C',
    fontSize: 17.5,
    fontFamily: 'Customfont-Regular',
    textAlign: 'center',
    paddingHorizontal: 30,
  },
  top_button: {
    marginBottom: 25,
  },
  big_button: {
    borderWidth: 2,
    borderColor: '#44234C',
    borderRadius: 5,
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7.5,
    paddingBottom: 12.5,
  },
  button_text: {
    color: '#44234C',
    fontSize: 25,
    fontFamily: 'Customfont-Bold',
  },
});
export default Startup;
