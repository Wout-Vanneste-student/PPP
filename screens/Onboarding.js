import React, { Component } from "react";
import AppIntroSlider from "react-native-app-intro-slider";
import * as Font from "expo-font";

import {
  AsyncStorage,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  Platform,
  StatusBar
} from "react-native";

const slides = [
  {
    key: "onboarding1",
    title: "Wizer planning",
    text: "Keep track off everything on your planning",
    title_image: require("../assets/img/wizer_white.png"),
    image: require("../assets/img/todo.png"),
    backgroundColor: "#44234C"
  },
  {
    key: "onboarding2",
    title: "Wizer weather",
    text: "Check the weather at any time, anywhere",
    title_image: require("../assets/img/wizer_white.png"),
    image: require("../assets/img/weather.png"),
    backgroundColor: "#44234C"
  }
];

class Onboarding extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false
    };
  }
  static navigationOptions = {
    header: null
  };
  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    const { navigate } = this.props.navigation;
    const seen = await AsyncStorage.getItem("seenOnboarding");
    const user = await AsyncStorage.getItem("userId");
    if (seen !== null && user === null) {
      navigate("Startup");
    } else if (seen !== null && user !== null) {
      navigate("Loadprofile");
    }
    await Font.loadAsync({
      "Customfont-Regular": require("../assets/fonts/Customfont-Regular.ttf")
    });
    this.setState({ fontLoaded: true });
  };
  _renderItem = ({ item }) => {
    return (
      <SafeAreaView style={styles.onboarding}>
        <Image style={styles.title_image} source={item.title_image}></Image>
        <Image style={styles.image} source={item.image}></Image>
        <Text style={styles.onboardingText}>{item.text}</Text>
      </SafeAreaView>
    );
  };
  _renderNextButton = () => {
    return <Text style={[styles.customButton, styles.rightButton]}>Next</Text>;
  };
  _renderDoneButton = () => {
    return <Text style={[styles.customButton, styles.rightButton]}>Done</Text>;
  };
  _renderSkipButton = () => {
    return <Text style={[styles.customButton, styles.leftButton]}>Skip</Text>;
  };
  _renderPrevButton = () => {
    return (
      <Text style={[styles.customButton, styles.leftButton]}>Previous</Text>
    );
  };

  _onDone = () => {
    AsyncStorage.setItem("seenOnboarding", "true");
    const { navigate } = this.props.navigation;
    navigate("Startup");
  };

  render() {
    return this.state.fontLoaded === false ? null : (
      <AppIntroSlider
        showSkipButton
        showPrevButton
        renderDoneButton={this._renderDoneButton}
        renderNextButton={this._renderNextButton}
        renderSkipButton={this._renderSkipButton}
        renderPrevButton={this._renderPrevButton}
        renderItem={this._renderItem}
        slides={slides}
        onDone={this._onDone}
        dotStyle={{ backgroundColor: "rgba(92, 61, 144, 1)" }}
        activeDotStyle={{ backgroundColor: "rgba(255, 255, 255, 1)" }}
        style={styles.hideStatusBar}
      />
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  onboarding: {
    paddingTop: 25,
    paddingBottom: 100,
    backgroundColor: "#44234C",
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center"
  },
  onboardingText: {
    color: "white",
    fontSize: 20,
    fontFamily: "Customfont-Regular",
    textAlign: "center",
    paddingHorizontal: 30
  },
  title_image: {
    width: 150,
    height: 75,
    resizeMode: "contain"
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },
  customButton: {
    fontFamily: "Customfont-Regular",
    fontSize: 17.5,
    color: "white",
    marginTop: 7.5
  },
  leftButton: {
    marginLeft: 15
  },
  rightButton: {
    marginRight: 15
  }
});

export default Onboarding;
