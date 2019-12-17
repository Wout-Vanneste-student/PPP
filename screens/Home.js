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
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Firebase, colors} from '../extensions/wizerCore';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      pastItems: [],
    };
  }

  componentDidMount() {
    this.reloadPastPlanning();
    this.getPastPlanning();
  }

  getPastPlanning = async () => {
    let pastData = await AsyncStorage.getItem('pastPlanning');
    if (pastData !== null) {
      this.setState({pastItems: JSON.parse(pastData)});
    } else {
      const currentUserId = await Firebase.getCurrentUserId();
      pastData = await Firebase.getPlanningUser(currentUserId);
    }
  };

  onRefresh = () => {
    this.reloadPastPlanning();
    this.getPastPlanning();
  };

  reloadPastPlanning = async () => {
    const pastList = [];
    const currentUserId = await Firebase.getCurrentUserId();
    const dataList = [];
    const data = await Firebase.getPlanningUser(currentUserId);
    let removeList = [];
    data.forEach(item => {
      const key = item.key;
      const itemStringify = JSON.stringify(item);
      const itemArray = JSON.parse(itemStringify);
      const notificationMessage = itemArray.notifMessage;
      const notificationDate = itemArray.notifDate;
      const notificationKey = itemArray.notifKey;
      const notifDateString = JSON.stringify(notificationDate);
      const dateDay = notifDateString.substring(1, 3);
      const dateMonth = notifDateString.substring(4, 6);
      const dateYear = notifDateString.substring(7, 11);
      const dateHours = notifDateString.substring(15, 17);
      const dateMinutes = notifDateString.substring(18, 20);
      const dateFormat = dateYear + '/' + dateMonth + '/' + dateDay;
      let checkDate = new Date(dateFormat);
      checkDate.setSeconds(0);
      checkDate.setMinutes(dateMinutes);
      checkDate.setHours(dateHours);
      const toAddItem = {
        key,
        notificationMessage,
        notificationDate,
        notificationKey,
      };
      if (new Date().getTime() > checkDate.getTime()) {
        removeList.push(toAddItem);
      } else {
        dataList.push(toAddItem);
      }
    });
    removeList.forEach(async item => {
      const pastMessage = item.notificationMessage;
      const pastItemDate = item.notificationDate;
      const pastItem = {pastMessage, pastItemDate};
      await Firebase.addPastItem(currentUserId, pastItem);
      await Firebase.removePlanningItem(currentUserId, item.key);
    });
    await AsyncStorage.removeItem('userPlanning');
    await AsyncStorage.setItem('userPlanning', JSON.stringify(dataList));
    const pastData = await Firebase.getPastPlanningUser(currentUserId);
    pastData.forEach(pastItem => {
      const pastKey = pastItem.key;
      const pastItemString = JSON.stringify(pastItem);
      const pastItemArray = JSON.parse(pastItemString);
      const pastMessage = pastItemArray.pastMessage;
      const pastDate = pastItemArray.pastItemDate;
      const toAddPastItem = {
        pastKey,
        pastMessage,
        pastDate,
      };
      pastList.push(toAddPastItem);
    });
    await AsyncStorage.removeItem('pastPlanning');
    await AsyncStorage.setItem('pastPlanning', JSON.stringify(pastList));
  };

  handleRemoveItem = async item => {
    const currentUserId = await Firebase.getCurrentUserId();
    await Firebase.removePastItem(currentUserId, item.pastKey);
    await this.reloadPastPlanning();
    this.getPastPlanning();
  };

  handleRemoveAllItems = async () => {
    const currentUserId = await Firebase.getCurrentUserId();
    await Firebase.removeAllPastItems(currentUserId);
    await this.reloadPastPlanning();
    this.getPastPlanning();
  };

  render() {
    return (
      <>
        <SafeAreaView style={styles.topBar} />
        <SafeAreaView style={styles.hideStatusBar}>
          <StatusBar barStyle="light-content" />
          <View style={styles.planningWrapper}>
            <View style={styles.scrollview}>
              <ScrollView
                // contentContainerStyle={styles.scrollview}
                refreshControl={
                  <RefreshControl
                    colors={[colors.wizer]}
                    tintColor="#44234C"
                    onRefresh={this.onRefresh}
                    refreshing={this.state.refreshing}
                  />
                }>
                {this.state.pastItems.length === 0 ? (
                  <View style={styles.imageView}>
                    <Image
                      source={require('../assets/img/cosy.png')}
                      style={styles.freeImg}
                    />
                    <Text style={styles.planningHelp}>
                      Chill, you've done everything you needed to do
                    </Text>
                  </View>
                ) : (
                  <View style={styles.homeFlex}>
                    <View>
                      <Text style={styles.itemsTitle}>
                        Here are your past reminders. {'\n'} Ready to get rid of
                        them forever?
                      </Text>
                      <PastPlanning
                        data={this.state.pastItems}
                        handleRemoveItem={this.handleRemoveItem}
                      />
                    </View>
                  </View>
                )}
              </ScrollView>
            </View>
            {this.state.pastItems.length === 0 ? null : (
              <TouchableOpacity
                onPress={this.handleRemoveAllItems}
                style={styles.big_button}>
                <Text style={styles.buttonText}>Remove all items</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const PastPlanning = ({data, handleRemoveItem}) => {
  return (
    <>
      {data.map((item, i) => {
        return (
          <View
            style={
              i === data.length - 1
                ? styles.planningItem
                : [styles.planningItem, styles.planningItemBorder]
            }
            key={i}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item)}>
              <Image
                style={styles.removeImage}
                source={require('../assets/img/trashcan.png')}
              />
            </TouchableOpacity>
            <View>
              <Text style={styles.planningDate}>{item.pastDate}</Text>
              <View style={styles.flexshrink}>
                <Text style={styles.planningText}>{item.pastMessage}</Text>
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
  homeFlex: {
    flex: 1,
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
  },
  itemsTitle: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
    color: colors.wizer,
    textAlign: 'center',
    fontSize: 17.5,
    marginTop: Platform.OS === 'android' ? 0 : 15,
    lineHeight: 30,
    marginBottom: 25,
  },
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    marginHorizontal: 20,
  },
  flexshrink: {flexShrink: 1},
  scrollview: {paddingBottom: 25, flex: 1},
  planningWrapper: {
    display: 'flex',
    height: '100%',
    flex: 1,
    justifyContent: 'space-between',
  },
  planningItemBorder: {
    borderBottomColor: colors.wizer,
    borderBottomWidth: 1,
  },
  planningItem: {
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  planningDate: {
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
  },
  planningHelp: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
    color: colors.wizer,
    textAlign: 'center',
    marginTop: 30,
  },
  planningText: {
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    fontSize: 17.5,
    flexWrap: 'wrap',
    marginRight: 35,
  },
  removeButton: {
    marginRight: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  removeImage: {
    width: 22,
    height: 27.5,
    resizeMode: 'contain',
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
  big_button: {
    borderWidth: 2,
    borderColor: colors.wizer,
    borderRadius: 5,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'android' ? 10 : 5,
    alignSelf: 'center',
    marginBottom: 25,
  },
  buttonText: {
    color: colors.wizer,
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
});

export default Home;
