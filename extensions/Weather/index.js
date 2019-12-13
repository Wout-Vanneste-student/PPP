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

import {API_KEY} from './openWeatherApi';

import Geolocation from 'react-native-geolocation-service';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';

const weatherIcons = {
  day01: require('./assets/01d.png'),
  day02: require('./assets/02d.png'),
  day03: require('./assets/03d.png'),
  day04: require('./assets/04d.png'),
  day09: require('./assets/09d.png'),
  day10: require('./assets/10d.png'),
  day11: require('./assets/11d.png'),
  day13: require('./assets/13d.png'),
  day50: require('./assets/50d.png'),
  night01: require('./assets/01n.png'),
  night02: require('./assets/02n.png'),
  night03: require('./assets/03n.png'),
  night04: require('./assets/04n.png'),
  night09: require('./assets/09n.png'),
  night10: require('./assets/10n.png'),
  night11: require('./assets/11n.png'),
  night13: require('./assets/13n.png'),
  night50: require('./assets/50n.png'),
};

class WeatherClass extends Component {
  constructor() {
    super();
    this.state = {
      temperature: null,
      weatherCondition: null,
      isLoading: true,
      city: null,
      minTemp: null,
      maxTemp: null,
      humidity: null,
      lat: null,
      long: null,
    };
  }

  extensionIcon = () => {
    const icons = {
      icon: require('../Weather/icon.png'),
    };
    return icons.icon;
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
          humidity: json.main.humidity,
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
      humidity,
    } = this.state;
    return isLoading === true ? (
      <SafeAreaView style={styles.hideStatusBar}>
        <Text style={styles.loadingText}>Weather is loading</Text>
        <ActivityIndicator size="large" color="#44234C" />
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
          humidity={humidity}
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
  humidity,
}) => {
  const tempRounded = Math.round(temperature * 10) / 10;
  const minTempRounded = Math.round(minTemp * 10) / 10;
  const maxTempRounded = Math.round(maxTemp * 10) / 10;
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
    <View>
      <View style={styles.currentWeather}>
        <View
          style={[styles.currentWeatherFlex, styles.currentWeatherFlexLeft]}>
          <Text style={styles.tempText}>{tempRounded}</Text>
          <Text style={styles.locationText}>In {city}</Text>
        </View>
        <View
          style={[styles.currentWeatherFlex, styles.currentWeatherFlexRight]}>
          <Image style={styles.weatherImg} source={toUseIcon} />
          <Text style={styles.conditionText}>{condition}</Text>
        </View>
      </View>
      <View>
        <Text style={styles.todayWeatherText}>Today's weather</Text>
        <View>
          <Text style={styles.todayWeatherInfo}>Min: {minTempRounded}</Text>
          <Text style={styles.todayWeatherInfo}>Max: {maxTempRounded}</Text>
          <Text style={styles.todayWeatherInfo}>Humidity: {humidity}%</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  currentWeather: {
    marginBottom: 75,
    marginTop: 25,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherImg: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  currentWeatherFlexRight: {
    marginRight: 15,
  },
  currentWeatherFlexLeft: {
    marginLeft: 15,
  },
  currentWeatherFlex: {
    alignItems: 'center',
  },
  conditionText: {
    fontSize: 17,
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  tempText: {
    fontSize: 50,
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  locationText: {
    fontSize: 20,
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  todayWeatherText: {
    fontSize: 30,
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 15,
  },
  todayWeatherInfo: {
    fontSize: 20,
    marginBottom: 5,
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  // weatherImgCircle: {
  //   width: 80,
  //   height: 80,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  //   borderRadius: 50,
  // },
  // weatherImgView: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // weatherContainer: {
  //   flex: 1,
  // },
  // headerContainer: {
  //   paddingTop: 50,
  //   flex: 1,
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   justifyContent: 'space-around',
  // },

  // loadingText: {
  //   fontSize: 25,
  //   color: '#44234C',
  //   textAlign: 'center',
  //   fontFamily:
  //     Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  //   marginBottom: 75,
  //   marginTop: 50,
  // },
  // title: {
  //   fontSize: 35,
  //   color: '#44234C',
  //   fontFamily:
  //     Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  // },
  // subtitle: {
  //   fontSize: 15,
  //   marginLeft: 20,
  //   color: '#44234C',
  //   fontFamily:
  //     Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  // },
  // weatherImgBackground: {
  //   width: '100%',
  //   paddingTop: 10,
  //   paddingBottom: Platform.OS === 'android' ? 15 : 10,
  //   // backgroundColor: '#44234C',
  //   borderRadius: 100,
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   alignItems: 'center',
  //   marginBottom: 10,
  // },
});

export default WeatherClass;
