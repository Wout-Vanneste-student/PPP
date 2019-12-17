import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Platform,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import {Firebase, NotificationService, colors, generateKey} from '../wizerCore';
const FOOTBALL_API_KEY = '37bdabc497bc42b39a26396352b9211a';

class FootballClass extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: true,
      games: [],
      isRefreshing: false,
      footballError: null,
    };
    this.notif = new NotificationService();
  }

  extensionIcon = () => {
    const icons = {
      icon: require('./icon.png'),
    };
    return icons.icon;
  };

  componentDidMount() {
    this.retrieveData();
  }

  retrieveData = async () => {
    try {
      let football = await fetch(
        'https://api.football-data.org/v2/teams/65/matches?status=SCHEDULED&limit=5',
        {
          headers: {'X-Auth-Token': FOOTBALL_API_KEY},
        },
      );
      const footballJson = await football.json();
      this.setState({
        games: footballJson.matches,
        isLoading: false,
        footballError: null,
      });
    } catch (error) {
      this.setState({footballError: "We couldn't get the upcoming matches."});
      console.log('football error: ', error);
    }
  };

  handleWatchGame = async game => {
    let gameDateTime = new Date(game.utcDate);
    gameDateTime = new Date(gameDateTime.setHours(gameDateTime.getHours() - 1));
    let otherTeam = game.awayTeam.name;
    if (otherTeam === 'Manchester City FC') {
      otherTeam = game.homeTeam.name;
    }
    const message =
      "Don't forget to watch the Man City game against " +
      otherTeam +
      ' in 1 hour!';
    let dd = gameDateTime.getDate();
    let mm = gameDateTime.getMonth() + 1;
    const yyyy = gameDateTime.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    let hh = gameDateTime.getHours();
    let minmin = gameDateTime.getMinutes();
    if (hh < 10) {
      hh = '0' + hh;
    }
    if (minmin < 10) {
      minmin = '0' + minmin;
    }
    const notifTimeFormat = hh + ':' + minmin;
    const notifDateFormat = dd + '/' + mm + '/' + yyyy;
    const notifDate = notifDateFormat + ' at ' + notifTimeFormat;
    const currentUserId = await Firebase.getCurrentUserId();
    const notifKey = generateKey;
    const sortDate = JSON.stringify(gameDateTime);
    const notifMessage = message;
    const planningData = {
      notifDate,
      notifMessage,
      notifKey,
      sortDate,
    };
    try {
      await Firebase.addPlanningItem(planningData, currentUserId);
    } catch (error) {
      console.log(error);
    } finally {
      const roundSecondsDate = new Date(new Date(gameDateTime).setSeconds(0));
      const uniqueKey = JSON.stringify(notifKey);
      this.notif.scheduleNotif(roundSecondsDate, message, uniqueKey);
    }
    showMessage({
      message: 'Added to planning!',
      type: 'info',
      style: styles.showMessage,
      titleStyle: styles.showMessageTitle,
    });
  };

  onRefresh = () => {
    this.retrieveData();
  };

  render() {
    const {games, isLoading, footballError} = this.state;
    return (
      <View style={styles.hideStatusBar}>
        {footballError === null ? (
          isLoading ? (
            <>
              <Text style={styles.loadingText}>Loading games</Text>
              <ActivityIndicator size="large" color="#44234C" />
            </>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl
                  colors={[colors.wizer]}
                  tintColor="#44234C"
                  onRefresh={this.onRefresh}
                  refreshing={this.state.isRefreshing}
                />
              }>
              <Text style={styles.headerText}>
                Upcoming games for Manchester City
              </Text>
              {games.map((game, i) => {
                const awayteam = game.awayTeam.name;
                const hometeam = game.homeTeam.name;
                const date = new Date(game.utcDate);

                let dd = date.getDate();
                let mm = date.getMonth() + 1;
                const yyyy = date.getFullYear();
                if (dd < 10) {
                  dd = '0' + dd;
                }
                if (mm < 10) {
                  mm = '0' + mm;
                }
                let hh = date.getHours() - 1;
                let minmin = date.getMinutes();
                if (hh < 10) {
                  hh = '0' + hh;
                }
                if (minmin < 10) {
                  minmin = '0' + minmin;
                }
                const gameTimeFormat = hh + ':' + minmin;
                const gameDateFormat = dd + '/' + mm + '/' + yyyy;
                const gameFormat = gameDateFormat + ' at ' + gameTimeFormat;
                return (
                  <View
                    style={[
                      i === games.length - 1
                        ? styles.gameItem
                        : [styles.gameItem, styles.gameItemBorder],
                      i === 0 ? null : styles.gameItemMarginTop,
                    ]}
                    key={i}>
                    <Text style={styles.gameTeams}>{hometeam}</Text>
                    <Text style={styles.vsTeam}>VS</Text>
                    <Text style={[styles.gameTeams, styles.awayTeam]}>
                      {awayteam}
                    </Text>
                    <Text style={styles.gameTime}>
                      On {gameFormat} (local time)
                    </Text>
                    <TouchableOpacity
                      style={styles.reminderButton}
                      onPress={() => this.handleWatchGame(game)}>
                      <Text style={styles.reminderButtonText}>
                        Remind me to watch this game!
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          )
        ) : (
          <Text style={styles.loadingText}>{footballError}</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  showMessage: {
    backgroundColor: colors.wizer,
  },
  showMessageTitle: {
    fontSize: 17,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
  },
  loadingText: {
    fontSize: 25,
    color: colors.wizer,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    marginBottom: 75,
    marginTop: 50,
  },
  gameItem: {
    paddingBottom: 25,
  },
  gameItemBorder: {
    borderBottomColor: colors.wizer,
    borderBottomWidth: 1,
  },
  gameItemMarginTop: {
    paddingTop: 25,
  },
  headerText: {
    fontSize: 17.5,
    color: colors.wizer,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
    marginBottom: 25,
  },
  reminderButton: {
    borderWidth: 1,
    borderColor: colors.wizer,
    borderRadius: 5,
    width: 240,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'android' ? 10 : 5,
    marginTop: 15,
  },
  reminderButtonText: {
    fontSize: 15,
    alignSelf: 'center',
    color: colors.wizer,
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  gameTeams: {
    fontSize: 16,
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  vsTeam: {
    fontSize: 16,
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
  awayTeam: {
    marginBottom: 10,
  },
  gameTime: {
    fontSize: 15,
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-italic',
  },
});

export default FootballClass;
