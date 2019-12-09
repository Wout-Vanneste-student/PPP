import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';

import {API_KEY} from '../config/Weather/openWeatherApi';

import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const weatherIcons = {
  day01: require('../assets/weatherIcons/01d.png'),
  day02: require('../assets/weatherIcons/02d.png'),
  day03: require('../assets/weatherIcons/03d.png'),
  day04: require('../assets/weatherIcons/04d.png'),
  day09: require('../assets/weatherIcons/09d.png'),
  day10: require('../assets/weatherIcons/10d.png'),
  day11: require('../assets/weatherIcons/11d.png'),
  day13: require('../assets/weatherIcons/13d.png'),
  day50: require('../assets/weatherIcons/50d.png'),
  night01: require('../assets/weatherIcons/01n.png'),
  night02: require('../assets/weatherIcons/02n.png'),
  night03: require('../assets/weatherIcons/03n.png'),
  night04: require('../assets/weatherIcons/04n.png'),
  night09: require('../assets/weatherIcons/09n.png'),
  night10: require('../assets/weatherIcons/10n.png'),
  night11: require('../assets/weatherIcons/11n.png'),
  night13: require('../assets/weatherIcons/13n.png'),
  night50: require('../assets/weatherIcons/50n.png'),
};

class Weather extends Component {
  constructor() {
    super();
    this.state = {
      temperature: null,
      weatherCondition: null,
      isLoading: true,
      city: null,
      minTemp: null,
      maxTemp: null,
      lat: null,
      long: null,
    };
  }
  static navigationOptions = {
    header: null,
    headerMode: 'none',
  };

  componentDidMount() {
    this.retrieveData();
  }

  fetchWeather = (lat = 50.9, lon = 3.3) => {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`,
    )
      .then(res => res.json())
      .then(json => {
        this.setState({
          temperature: json.main.temp,
          weatherCondition: json.weather[0].main,
          icon: json.weather[0].icon,
          city: json.name,
          minTemp: json.main.temp_min,
          maxTemp: json.main.temp_max,
          isLoading: false,
        });
      });
  };

  retrieveData = async () => {
    let status = '';
    if (Platform.OS === 'android') {
      await check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
        .then(async result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              status = 'UNAVAILABLE';
              await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
              break;
            case RESULTS.DENIED:
              await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
              break;
            case RESULTS.GRANTED:
              status = 'GRANTED';
              break;
            case RESULTS.BLOCKED:
              status = 'BLOCKED';
              break;
          }
        })
        .catch(error => {
          console.log('permission error: ', error);
        });
    } else {
      await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(async result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              status = 'UNAVAILABLE';
              await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
              break;
            case RESULTS.DENIED:
              await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
              break;
            case RESULTS.GRANTED:
              status = 'GRANTED';
              break;
            case RESULTS.BLOCKED:
              status = 'BLOCKED';
              break;
          }
        })
        .catch(error => {
          console.log('permission error: ', error);
        });
    }

    if (status === 'GRANTED') {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            lat: position.coords.latitude,
            long: position.coords.longitude,
          });
          this.fetchWeather(this.state.lat, this.state.long);
        },
        error => {
          console.log('error geolocation: ', error.code, error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }
  };

  render() {
    const {
      isLoading,
      weatherCondition,
      icon,
      minTemp,
      maxTemp,
      temperature,
      city,
    } = this.state;
    return isLoading === true ? (
      <SafeAreaView style={styles.hideStatusBar}>
        <Text style={styles.loadingText}>Weather is loading</Text>
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    ) : (
      <SafeAreaView style={styles.hideStatusBar}>
        <WeatherItem
          condition={weatherCondition}
          city={city}
          icon={icon}
          temperature={temperature}
          minTemp={minTemp}
          maxTemp={maxTemp}
        />
      </SafeAreaView>
    );
  }
}

const WeatherItem = ({
  condition,
  city,
  icon,
  temperature,
  minTemp,
  maxTemp,
}) => {
  const tempRounded = Math.round(temperature * 10) / 10;
  let toUseIcon;
  switch (icon) {
    case '01d':
      toUseIcon = weatherIcons.day01;
      break;
    case '02d':
      toUseIcon = weatherIcons.day02;
      break;
    case '03d':
      toUseIcon = weatherIcons.day03;
      break;
    case '04d':
      toUseIcon = weatherIcons.day04;
      break;
    case '09d':
      toUseIcon = weatherIcons.day09;
      break;
    case '10d':
      toUseIcon = weatherIcons.day10;
      break;
    case '11d':
      toUseIcon = weatherIcons.day11;
      break;
    case '13d':
      toUseIcon = weatherIcons.day13;
      break;
    case '50d':
      toUseIcon = weatherIcons.day50;
      break;
    case '01d':
      toUseIcon = weatherIcons.night01;
      break;
    case '01n':
      toUseIcon = weatherIcons.night01;
      break;
    case '02n':
      toUseIcon = weatherIcons.night02;
      break;
    case '03n':
      toUseIcon = weatherIcons.night03;
      break;
    case '04n':
      toUseIcon = weatherIcons.night04;
      break;
    case '09n':
      toUseIcon = weatherIcons.night09;
      break;
    case '10n':
      toUseIcon = weatherIcons.night10;
      break;
    case '11n':
      toUseIcon = weatherIcons.night11;
      break;
    case '13n':
      toUseIcon = weatherIcons.night13;
      break;
    case '50n':
      toUseIcon = weatherIcons.night50;
      break;
    default:
      toUseIcon = weatherIcons.day01;
      break;
  }
  return (
    <View style={styles.weatherContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.tempText}>{tempRounded}˚c</Text>
        <Text style={styles.tempText}>Min:{minTemp}˚c</Text>
        <Text style={styles.tempText}>Max:{maxTemp}˚c</Text>
      </View>
      <View style={styles.weatherImgView}>
        <View style={styles.weatherImgBackground}>
          <View style={styles.bodyContainer}>
            <Text style={styles.title}>{condition}</Text>
            <Text style={styles.subtitle}>In {city}</Text>
          </View>
          <Image style={styles.weatherImg} source={toUseIcon} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    backgroundColor: '#44234C',
  },
  weatherImg: {
    width: 65,
    height: 65,
    resizeMode: 'contain',
  },
  weatherImgView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
  },
  weatherContainer: {
    flex: 1,
  },
  headerContainer: {
    paddingTop: 50,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tempText: {
    fontSize: 50,
    color: '#fff',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  loadingText: {
    fontSize: 25,
    color: '#fff',
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 75,
    marginTop: 50,
  },
  title: {
    fontSize: 35,
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  subtitle: {
    fontSize: 15,
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  weatherImgBackground: {
    width: 300,
    height: 100,
    backgroundColor: '#fff',
    borderRadius: 50,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Weather;
