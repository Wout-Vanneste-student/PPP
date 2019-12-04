import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  Image
} from "react-native";
import * as Font from "expo-font";
import { API_KEY } from "../config/Weather/openWeatherApi";
import { weatherConditions } from "../config/Weather/weatherConditions";

class Weather extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      temperature: null,
      weatherCondition: null,
      isLoading: true,
      city: null
    };
  }
  static navigationOptions = {
    header: null,
    headerMode: "none"
  };

  componentDidMount() {
    this.retrieveData();
  }

  fetchWeather = (lat = 25, lon = 25) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          city: json.name,
          isLoading: false
        });
      });
  };

  retrieveData = async () => {
    await Font.loadAsync({
      "Customfont-Regular": require("../assets/fonts/Customfont-Regular.ttf")
    });
    await navigator.geolocation.getCurrentPosition(
      position => {
        this.fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.log("error: ", error);
      }
    );
    this.setState({ fontLoaded: true });
  };

  render() {
    const { isLoading, weatherCondition, temperature, city } = this.state;
    return this.state.fontLoaded === false || isLoading === true ? null : (
      <SafeAreaView style={styles.hideStatusBar}>
        <WeatherItem
          weather={weatherCondition}
          temperature={temperature}
          city={city}
        />
      </SafeAreaView>
    );
  }
}

const WeatherItem = ({ city, weather, temperature }) => {
  const tempRounded = Math.round(temperature * 10) / 10;
  return (
    <View style={styles.weatherContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>{tempRounded}˚c</Text>
      </View>
      <View style={styles.weatherImgView}>
        <Image
          style={styles.weatherImg}
          source={weatherConditions[weather].image}
        ></Image>
      </View>
      <View style={styles.bodyContainer}>
        <Text style={styles.title}>{weatherConditions[weather].title}</Text>
        <Text style={styles.subtitle}>In {city}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    flex: 1
  },
  weatherImg: {
    width: 300,
    height: 300,
    resizeMode: "contain"
  },
  weatherImgView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40
  },
  weatherContainer: {
    flex: 1,
    backgroundColor: "#44234C"
  },
  headerContainer: {
    paddingTop: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around"
  },
  tempText: {
    fontSize: 50,
    color: "#fff",
    fontFamily: "Customfont-Regular"
  },
  bodyContainer: {
    flex: 2,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    paddingLeft: 25,
    marginBottom: 40
  },
  title: {
    fontSize: 35,
    color: "#fff",
    fontFamily: "Customfont-Regular"
  },
  subtitle: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Customfont-Regular"
  }
});

export default Weather;
