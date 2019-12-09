import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firebase from '../config/Firebase';
import NotificationService from '../config/Notifications/NotificationService';

class Planning extends Component {
  constructor() {
    super();
    this.state = {
      userPlanning: [],
    };
    this.notif = new NotificationService();
  }
  static navigationOptions = {
    header: null,
  };

  cancelNotif = async number => {
    this.notif.cancelNotif(JSON.stringify(number));
  };

  getPlanning = async () => {
    const dataList = await AsyncStorage.getItem('userPlanning');
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
    const dataList = [];
    const currentUserId = await firebase.getCurrentUserId();
    const data = await firebase.getPlanningUser(currentUserId);
    data.forEach(item => {
      const key = item.key;
      const itemStringify = JSON.stringify(item);
      const itemArray = JSON.parse(itemStringify);
      const notificationMessage = itemArray.notifMessage;
      const notificationDate = itemArray.notifDate;
      const notificationKey = itemArray.notifKey;
      const toAddItem = {
        key,
        notificationMessage,
        notificationDate,
        notificationKey,
      };
      dataList.push(toAddItem);
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

  render() {
    const {navigate} = this.props.navigation;
    return this.state.userPlanning === [] ? null : (
      <SafeAreaView
        forceInset={{bottom: 'always', top: 'never'}}
        style={styles.hideStatusBar}>
        <View>
          <View style={styles.topFlex}>
            <Image
              source={require('../assets/img/wizer_dark.png')}
              style={styles.brandingImage}
            />
            <Text style={styles.headerText}>Your planning</Text>
          </View>

          {this.state.userPlanning.length === 0 ? (
            <View style={styles.imageView}>
              <Image
                source={require('../assets/img/free.png')}
                style={styles.freeImg}
              />
              <Text style={styles.planningHelp}>
                You're totally free, relax!
              </Text>
            </View>
          ) : (
            <>
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
          onPress={() => navigate('Addplanning')}>
          <Text style={styles.button_text}>Add item to planning</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const UserPlanning = ({data, handleRemovePlanningItem}) => {
  return (
    <>
      {data.map((item, i) => {
        return (
          <View style={styles.planningItem} key={i}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemovePlanningItem(item)}>
              <Image
                style={styles.removeImage}
                source={require('../assets/img/trashcan.png')}
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
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    marginBottom: 25,
    // paddingHorizontal: Platform.OS === "android" ? 15 : 0,
    marginHorizontal: 15,
    flex: 1,
    display: 'flex',
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
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 5,
    paddingBottom: Platform.OS === 'android' ? 10 : 5,
    alignSelf: 'center',
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
  planningItem: {
    marginBottom: 15,
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: '#788ADA',
    paddingBottom: 15,
    borderBottomWidth: 1,
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

export default Planning;
