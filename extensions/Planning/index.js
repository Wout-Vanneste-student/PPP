import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Firebase, NotificationService, colors} from '../wizerCore';
import Addplanning from './Addplanning';

class PlanningClass extends Component {
  constructor() {
    super();
    this.state = {
      userPlanning: [],
      addPlanning: false,
      refreshing: false,
    };
    this.notif = new NotificationService();
    this.addItem = this.addItem.bind(this);
  }

  extensionIcon = () => {
    const icons = {
      icon: require('./icon.png'),
    };
    return icons.icon;
  };

  cancelNotif = async number => {
    this.notif.cancelNotif(JSON.stringify(number));
  };

  getPlanning = async () => {
    let dataList = await AsyncStorage.getItem('userPlanning');
    if (dataList !== null) {
      this.setState({userPlanning: JSON.parse(dataList)});
    }
  };

  componentDidMount() {
    this.retrieveData();
  }

  componentDidUpdate() {
    this._reloadUserPlanning();
  }

  _reloadUserPlanning = async () => {
    await this.getPlanning();
  };

  reloadPlanning = async () => {
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
    await this.getPlanning();
  };

  retrieveData = async () => {
    await this.getPlanning();
  };

  handleRemovePlanningItem = async item => {
    this.cancelNotif(item.notificationKey);
    const currentUserId = await Firebase.getCurrentUserId();
    console.log(
      'currentuserid in handleremoveplanningitem planning: ',
      currentUserId,
    );
    await Firebase.removePlanningItem(currentUserId, item.key);
    this.reloadPlanning();
  };

  addItem = () => {
    this.setState({addPlanning: false});
  };

  reloadPastPlanning = async () => {
    const pastList = [];
    const currentUserId = await Firebase.getCurrentUserId();
    console.log(
      'currentuserid in reloadpastplanning planning: ',
      currentUserId,
    );
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

  onRefresh = async () => {
    this.setState({refreshing: true});
    await this.reloadPlanning();
    await this.reloadPastPlanning();
    this.setState({refreshing: false});
  };

  render() {
    return this.state.addPlanning ? (
      <Addplanning action={this.addItem} />
    ) : (
      <View style={styles.planningWrapper}>
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewFlex}
            showsVerticalScrollIndicator={
              this.state.userPlanning.length === 0 ? false : true
            }
            style={styles.scrollview}
            refreshControl={
              <RefreshControl
                onRefresh={this.onRefresh}
                refreshing={this.state.refreshing}
                colors={[colors.wizer]}
                tintColor="#44234C"
              />
            }>
            {this.state.userPlanning.length === 0 ? (
              <View style={styles.imageView}>
                <Image source={require('./free.png')} style={styles.freeImg} />
                <Text style={styles.planningHelp}>
                  You're totally free, relax!
                </Text>
              </View>
            ) : (
              <UserPlanning
                style={styles.userplanning}
                data={this.state.userPlanning}
                handleRemovePlanningItem={this.handleRemovePlanningItem}
              />
            )}
          </ScrollView>
        </View>
        <TouchableOpacity
          style={styles.big_button}
          onPress={() => this.setState({addPlanning: true})}>
          <Text style={styles.button_text}>Add item to planning</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const UserPlanning = ({data, handleRemovePlanningItem}) => {
  return (
    <>
      <View style={styles.planningHeader}>
        <Text style={styles.planningHeaderText}>
          This is your upcoming planning
        </Text>
      </View>
      <View style={styles.planningStyle}>
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
                onPress={() => handleRemovePlanningItem(item)}>
                <Image
                  style={styles.removeImage}
                  source={require('./trashcan.png')}
                />
              </TouchableOpacity>
              <View>
                <Text style={styles.planningDate}>{item.notificationDate}</Text>
                <View style={styles.flexshrink}>
                  <Text style={styles.planningText}>
                    {item.notificationMessage}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>
      <Text style={styles.planningHelp}>
        You can scroll through your planning.
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  planningStyle: {
    flex: 1,
    height: '100%',
  },
  flexshrink: {
    flexShrink: 1,
  },
  scrollview: {
    height: '80%',
  },
  scrollViewFlex: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  planningWrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  planningHelp: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
    color: colors.wizer,
    textAlign: 'center',
    marginTop: 30,
  },
  customfont: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    color: colors.wizer,
  },
  planningHeader: {
    marginTop: 5,
    marginBottom: 20,
  },
  planningHeaderText: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-bold',
    color: colors.wizer,
    fontSize: 20,
  },
  headerText: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    fontSize: 25,
    color: colors.wizer,
  },
  brandingImage: {
    width: 90,
    height: 30,
    resizeMode: 'contain',
  },
  topFlex: {
    paddingVertical: 20,
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  buttonDisabled: {
    opacity: 0.2,
  },
  button_text: {
    color: colors.wizer,
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  planningItemBorder: {
    borderBottomColor: colors.wizer,
    borderBottomWidth: 1,
  },
  planningItem: {
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  planningDate: {
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
  },
  planningText: {
    color: colors.wizer,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    fontSize: 17.5,
    // flex: 1,
    // flexWrap: 'wrap',
    // marginRight: 35,
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
});

export default PlanningClass;
