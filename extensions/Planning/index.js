import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../../config/Firebase';
import NotificationService from '../../config/Notifications/NotificationService';
import Addplanning from './Addplanning';

class PlanningClass extends Component {
  constructor() {
    super();
    this.state = {
      userPlanning: [],
      addPlanning: false,
    };
    this.notif = new NotificationService();
    this.addItem = this.addItem.bind(this);
    // this.extensionIcon = this.extensionIcon.bind(this);
  }

  extensionIcon = () => {
    const icons = {
      icon: require('../Planning/icon.png'),
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

  reloadPlanningAfterRemove = async () => {
    const currentUserId = await firebase.getCurrentUserId();
    const dataList = [];
    const data = await firebase.getPlanningUser(currentUserId);
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
      if (new Date().getTime() > checkDate.getTime() + 10000) {
        removeList.push(toAddItem);
      } else {
        dataList.push(toAddItem);
      }
    });
    removeList.forEach(async item => {
      console.log('remove: ', item);
      await firebase.removePlanningItem(this.currentUserId, item.key);
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

    const currentUserId = await firebase.getCurrentUserId();
    await firebase.removePlanningItem(currentUserId, item.key);
    this.reloadPlanningAfterRemove();
  };

  addItem = () => {
    this.setState({addPlanning: false});
  };

  render() {
    return this.state.addPlanning ? (
      <Addplanning action={this.addItem} />
    ) : (
      <View style={styles.planningWrapper}>
        <View>
          {this.state.userPlanning.length === 0 ? (
            <View style={styles.imageView}>
              <Image
                source={require('../../assets/img/free.png')}
                style={styles.freeImg}
              />
              <Text style={styles.planningHelp}>
                You're totally free, relax!
              </Text>
            </View>
          ) : (
            <>
              <View style={styles.planningHeader}>
                <Text style={styles.planningHeaderText}>
                  This is your planning
                </Text>
              </View>
              <ScrollView
                showsHorizontalScrollIndicator={false}
                style={styles.scrollview}>
                <UserPlanning
                  data={this.state.userPlanning}
                  handleRemovePlanningItem={this.handleRemovePlanningItem}
                />
              </ScrollView>
              <Text style={styles.planningHelp}>
                You can scroll through your planning.
              </Text>
            </>
          )}
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
                source={require('../../assets/img/trashcan.png')}
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
    </>
  );
};

const styles = StyleSheet.create({
  flexshrink: {flexShrink: 1},
  scrollview: {height: '70%'},
  planningWrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
  },
  planningHelp: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
    color: '#44234C',
    textAlign: 'center',
    marginTop: 30,
  },
  customfont: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    color: '#44234C',
  },
  planningHeader: {
    marginTop: 5,
    marginBottom: 20,
  },
  planningHeaderText: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-Bold' : 'Didot-bold',
    color: '#44234C',
    fontSize: 20,
  },
  headerText: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    fontSize: 25,
    color: '#44234C',
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
    borderColor: '#44234C',
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
    color: '#44234C',
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  planningItemBorder: {
    borderBottomColor: '#44234C',
    borderBottomWidth: 1,
  },
  planningItem: {
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    paddingBottom: 15,
  },
  planningDate: {
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
  },
  planningText: {
    color: '#44234C',
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    fontSize: 17.5,
    flex: 1,
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
});

export default PlanningClass;
