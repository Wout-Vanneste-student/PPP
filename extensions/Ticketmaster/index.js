import React, {Component} from 'react';
import {
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  StatusBar,
  View,
  Platform,
  ActivityIndicator,
  Linking,
} from 'react-native';

import {Firebase, NotificationService, colors} from '../wizerCore';
import AsyncStorage from '@react-native-community/async-storage';

class Ticketmaster extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      concerts: [],
      loading: true,
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
    this.getConcerts();
  }

  getConcerts = async () => {
    let concertsArray = [];
    const url =
      'https://app.ticketmaster.com/discovery/v2/events?apikey=KoPPdpVePgY3hHY8TjlVLpx7zJBYuJ4c&venueId=Z198xZG2Z1v7,Z198xZG2Z6vk,Z598xZG2Zee71,Z198xZG2ZdF1,Z598xZG2ZeAkF,Z598xZG2ZeAdk,Z198xZG2Za7F,KovZpZAlaAJA,Z198xZG2Z7dF,Z198xZG2Z7FF,Z198xZG2Zek7,Z198xZG2Zkve,Za98xZG2ZeF,Z598xZG2Ze1dk,Z598xZG2Zekk7,Z598xZG2Zevd1,Z198xZG2Z717&locale=*';
    try {
      let concerts = await fetch(url);
      concertsArray = await concerts.json();
    } catch (error) {
      console.log('error', error);
    }
    let concerts = [];
    concertsArray._embedded.events.forEach(event => {
      const venue = event._embedded.venues[0].name;
      const city = event._embedded.venues[0].city.name;
      const concert = event.name;
      const startTicketSale = event.sales.public.startDateTime;
      const endTicketSale = event.sales.public.endDateTime;
      const ticketUrl = event.url;
      const concertDateTime = event.dates.start.dateTime;
      const concertDate =
        event.dates.start.localDate + ' - ' + event.dates.start.localTime;
      const toAddConcert = {
        venue,
        city,
        concert,
        concertDateTime,
        startTicketSale,
        endTicketSale,
        ticketUrl,
        concertDate,
      };
      concerts.push(toAddConcert);
    });
    concerts.sort(function(a, b) {
      return new Date(a.concertDateTime) - new Date(b.concertDateTime);
    });
    this.setState({concerts: concerts, loading: false});
  };

  onRefresh = () => {
    this.getConcerts();
  };

  handleRemindConcert = async item => {
    const notifMessage =
      "Don't forget to buy tickets for " + item.concert + '!';
    const endSale = new Date(item.endTicketSale);
    const date = new Date(endSale.setDate(endSale.getDate() - 1));

    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }
    if (mm < 10) {
      mm = '0' + mm;
    }
    let hh = date.getHours();
    let minmin = date.getMinutes();
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
    const notifKey = Math.floor(Math.random() * Math.floor(100000000));
    const sortDate = JSON.stringify(date);
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
      const roundSecondsDate = new Date(new Date(date).setSeconds(0));
      const uniqueKey = JSON.stringify(notifKey);
      const message = notifMessage;
      this.notif.scheduleNotif(roundSecondsDate, message, uniqueKey);
    }
  };

  render() {
    const {concerts, loading} = this.state;
    return (
      <>
        <SafeAreaView style={styles.topBar} />
        <SafeAreaView style={styles.hideStatusBar}>
          <StatusBar barStyle="light-content" />
          <View style={styles.concertsWrapper}>
            <ScrollView
              style={styles.scrollview}
              refreshControl={
                <RefreshControl
                  colors={[colors.wizer]}
                  tintColor="#44234C"
                  onRefresh={this.onRefresh}
                  refreshing={this.state.refreshing}
                />
              }>
              {loading ? (
                <View style={styles.hideStatusBar}>
                  <Text style={styles.loadingText}>Loading concerts</Text>
                  <ActivityIndicator size="large" color="#44234C" />
                </View>
              ) : concerts.length === 0 ? (
                <View style={styles.imageView}>
                  <Image
                    source={require('./assets/noConcert.png')}
                    style={styles.freeImg}
                  />
                  <Text style={styles.concertHelpText}>
                    No new concerts found {'\n'} Come back later to discover new
                    concerts.
                  </Text>
                </View>
              ) : (
                <>
                  <Text style={styles.itemsTitle}>
                    Be first in line for these upcoming concerts!
                  </Text>
                  <PlannedConcerts
                    concerts={this.state.concerts}
                    handleRemindConcert={this.handleRemindConcert}
                  />
                </>
              )}
            </ScrollView>
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const PlannedConcerts = ({concerts, handleRemindConcert}) => {
  return (
    <>
      {concerts.map((item, i) => {
        const startDate = new Date(item.startTicketSale);
        let startdd = startDate.getDate();
        let startmm = startDate.getMonth() + 1;
        const startyyyy = startDate.getFullYear();
        if (startdd < 10) {
          startdd = '0' + startdd;
        }
        if (startmm < 10) {
          startmm = '0' + startmm;
        }
        let starthh = startDate.getHours();
        let startminmin = startDate.getMinutes();
        if (starthh < 10) {
          starthh = '0' + starthh;
        }
        if (startminmin < 10) {
          startminmin = '0' + startminmin;
        }
        const startTimeFormat = starthh + ':' + startminmin;
        const startDateFormat = startdd + '/' + startmm + '/' + startyyyy;
        const startSale = startDateFormat + ' - ' + startTimeFormat;
        const endDate = new Date(item.endTicketSale);
        let enddd = endDate.getDate();
        let endmm = endDate.getMonth() + 1;
        const endyyyy = endDate.getFullYear();
        if (enddd < 10) {
          enddd = '0' + enddd;
        }
        if (endmm < 10) {
          endmm = '0' + endmm;
        }
        let endhh = endDate.getHours();
        let endminmin = endDate.getMinutes();
        if (endhh < 10) {
          endhh = '0' + endhh;
        }
        if (endminmin < 10) {
          endminmin = '0' + endminmin;
        }
        const endTimeFormat = endhh + ':' + endminmin;
        const endDateFormat = enddd + '/' + endmm + '/' + endyyyy;
        const endSale = endDateFormat + ' - ' + endTimeFormat;
        const concertDate = new Date(item.concertDateTime);
        let concertdd = concertDate.getDate();
        let concertmm = concertDate.getMonth() + 1;
        const concertyyyy = concertDate.getFullYear();
        if (concertdd < 10) {
          concertdd = '0' + concertdd;
        }
        if (concertmm < 10) {
          concertmm = '0' + concertmm;
        }
        let concerthh = concertDate.getHours();
        let concertminmin = concertDate.getMinutes();
        if (concerthh < 10) {
          concerthh = '0' + concerthh;
        }
        if (concertminmin < 10) {
          concertminmin = '0' + concertminmin;
        }
        const concertTimeFormat = concerthh + ':' + concertminmin;
        const concertDateFormat =
          concertdd + '/' + concertmm + '/' + concertyyyy;
        const concertDateTime = concertDateFormat + ' - ' + concertTimeFormat;
        return (
          <View
            style={
              i === concerts.length - 1
                ? styles.concertItem
                : [styles.concertItem, styles.concertItemBorder]
            }
            key={i}>
            <View>
              <Text
                style={
                  i === 0
                    ? styles.concert
                    : [styles.concert, styles.concertTopMargin]
                }>
                {item.concert}
              </Text>
              <View style={styles.flexshrink}>
                <Text style={styles.venue}>
                  In {item.venue} in {item.city}
                </Text>
                <Text style={styles.concertDate}>
                  When?{' '}
                  <Text style={styles.concertDateBig}>{concertDateTime}</Text>
                </Text>
                <Text style={styles.ticketinfo}>Ticket info</Text>
                <Text style={styles.ticketSale}>
                  Ticketsale from {'\n'} {startSale} until {endSale}
                </Text>
                <View style={styles.buttonsFlex}>
                  <TouchableOpacity
                    style={styles.reminderButton}
                    onPress={() => handleRemindConcert(item)}>
                    <Text style={styles.reminderButtonText}>
                      Remind me to buy tickets!
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => {
                      Linking.openURL(item.ticketUrl);
                    }}>
                    <Text style={styles.buyButtonText}>Buy tickets</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flex: 0,
    backgroundColor: colors.wizer,
  },
  itemsTitle: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
    color: colors.wizer,
    textAlign: 'center',
    fontSize: 17.5,
    marginTop: Platform.OS === 'android' ? 0 : 15,
    lineHeight: 30,
    marginBottom: 10,
  },
  hideStatusBar: {
    flex: 1,
  },
  flexshrink: {
    flexShrink: 1,
  },
  scrollview: {
    height: '70%',
  },
  concertsWrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  concertItemBorder: {
    borderBottomColor: colors.wizer,
    borderBottomWidth: 1,
  },
  concertHelpText: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
    color: colors.wizer,
    textAlign: 'center',
    marginTop: 30,
  },
  freeImg: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  imageView: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
  },
  concert: {
    color: colors.wizer,
    fontSize: 17,
    marginBottom: 5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
  concertTopMargin: {
    paddingTop: 20,
  },
  venue: {
    color: colors.wizer,
    fontSize: 15,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-italic',
  },
  ticketinfo: {
    color: colors.wizer,
    fontSize: 15,
    marginTop: 10,
    marginBottom: 5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
  ticketSale: {
    color: colors.wizer,
    fontSize: 15,
    paddingBottom: 10,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  concertDate: {
    color: colors.wizer,
    fontSize: 15,
    marginVertical: 10,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  concertDateBig: {
    fontSize: 16,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
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
  buttonsFlex: {
    display: 'flex',
    marginBottom: 25,
  },
  reminderButton: {
    borderWidth: 1,
    borderColor: colors.wizer,
    borderRadius: 5,
    width: 215,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'android' ? 10 : 7.5,
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
  buyButton: {
    backgroundColor: colors.wizer,
    borderRadius: 5,
    width: 125,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7.5,
    paddingBottom: Platform.OS === 'android' ? 12.5 : 7.5,
    marginTop: 15,
  },
  buyButtonText: {
    fontSize: 15,
    alignSelf: 'center',
    color: '#fff',
    textAlign: 'center',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
  },
});

export default Ticketmaster;
