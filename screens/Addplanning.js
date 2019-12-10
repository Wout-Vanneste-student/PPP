import React, {Component} from 'react';
import {
  Text,
  SafeAreaView,
  View,
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import firebase from '../config/Firebase';
import NotificationService from '../config/Notifications/NotificationService';
import AsyncStorage from '@react-native-community/async-storage';

import DateTimePicker from '@react-native-community/datetimepicker';

class Addplanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifMessage: '',
      canSubmit: false,
      planningAdded: false,
      notifKeySet: false,
      notifDate: new Date(),
      mode: 'date',
      show: false,
      minDate: new Date(new Date().setDate(new Date().getDate() + 1)),
      selectedDateMinutes: null,
      selectedDateHours: null,
    };

    this.notif = new NotificationService();
  }

  static navigationOptions = {
    header: null,
  };

  scheduleNotif = async (date, message) => {
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
    const currentUserId = await firebase.getCurrentUserId();
    const notifMessage = this.state.notifMessage;
    const notifKey = Math.floor(Math.random() * Math.floor(100000000));
    const sortDate = JSON.stringify(date);
    const planningData = {
      notifDate,
      notifMessage,
      notifKey,
      sortDate,
    };
    try {
      const response = await firebase.addPlanningItem(
        planningData,
        currentUserId,
      );
      if (response) {
        this.setState({
          planningAdded: true,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (this.state.planningAdded === true) {
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
          await firebase.removePlanningItem(currentUserId, item.key);
        });
        AsyncStorage.removeItem('userPlanning');
        AsyncStorage.setItem('userPlanning', JSON.stringify(dataList));
        const roundSecondsDate = new Date(new Date(date).setSeconds(0));
        const test = JSON.stringify(notifKey);
        this.notif.scheduleNotif(roundSecondsDate, message, test);
        const {navigate} = this.props.navigation;
        navigate('Planning');
      }
    }
  };

  handleCheckText = () => {
    if (this.state.notifDate.getDate() !== new Date().getDate()) {
      this.setState({canSubmit: true});
    } else {
      this.setState({canSubmit: false});
    }
    this.setState({canSubmit: true});
  };

  setDate = (event, date) => {
    if (Platform.OS === 'android') {
      date = date || this.state.notifDate;
      let todayBelgianTime;
      if (this.state.mode === 'time') {
        todayBelgianTime = new Date(this.state.notifDate);
        let hh = date.getHours();
        let minmin = date.getMinutes();
        this.setState({selectedDateHours: hh, selectedDateMinutes: minmin});
        todayBelgianTime.setHours(hh);
        todayBelgianTime.setMinutes(minmin);
      } else {
        todayBelgianTime = new Date(date);
      }
      const selectedDate = new Date(todayBelgianTime);
      if (this.state.mode === 'time') {
        this.setState({mode: 'date'});
      } else {
        this.setState({mode: 'time'});
      }
      this.setState({
        show: Platform.OS === 'ios' ? true : false,
        notifDate: selectedDate,
      });
    } else {
      this.setState({
        show: Platform.OS === 'ios' ? true : false,
        notifDate: date,
      });
    }
    if (
      this.state.selectedDateMinutes !== null &&
      this.state.selectedDateHours !== null &&
      this.state.notifMessage !== ''
    ) {
      this.setState({canSubmit: true});
    }
  };

  show = mode => {
    this.setState({
      show: true,
      mode,
    });
  };

  datePicker = () => {
    this.show('date');
  };

  render() {
    const {navigate} = this.props.navigation;
    const {show, minDate, notifDate, mode} = this.state;
    let notificationDate;
    if (notifDate.getDate() !== new Date().getDate()) {
      let dd = notifDate.getDate();
      let mm = notifDate.getMonth() + 1;
      const yyyy = notifDate.getFullYear();
      if (dd < 10) {
        dd = '0' + dd;
      }
      if (mm < 10) {
        mm = '0' + mm;
      }
      const notifDateFormat = dd + '/' + mm + '/' + yyyy;
      let hh = notifDate.getHours();
      let minmin = notifDate.getMinutes();
      if (hh < 10) {
        hh = '0' + hh;
      }
      if (minmin < 10) {
        minmin = '0' + minmin;
      }
      const notifTimeFormat = hh + ':' + minmin;
      notificationDate = notifDateFormat + ' at ' + notifTimeFormat;
    }

    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <TouchableWithoutFeedback
          style={styles.flex}
          onPress={Keyboard.dismiss}
          accessible={false}>
          <View style={styles.touchableWithoutFeedback}>
            <View style={styles.formContainer}>
              <TouchableOpacity
                style={styles.goBack}
                onPress={() => navigate('Planning')}>
                <Image
                  style={styles.goBackArrow}
                  source={require('../assets/img/arrow.png')}
                />
                <Text style={styles.goBackText}>Go back</Text>
              </TouchableOpacity>
              <Text style={styles.formTitle}>
                Add something to your planning
              </Text>
              <View style={styles.firstInput}>
                <Text style={styles.inputLabel}>What do you want to plan?</Text>
                <TextInput
                  multiline={true}
                  textAlignVertical="top"
                  style={styles.textInput}
                  onEndEditing={this.handleCheckText}
                  onChangeText={notifMessage => this.setState({notifMessage})}
                  value={this.state.notifMessage}
                />
              </View>
              <View>
                <View>
                  <TouchableOpacity
                    style={styles.big_button}
                    onPress={this.datePicker}>
                    <Text style={styles.button_text}>
                      Select date &amp; time
                    </Text>
                  </TouchableOpacity>
                </View>
                {this.state.selectedDateHours !== null &&
                this.state.selectedDateMinutes !== null
                  ? null
                  : show && (
                      <DateTimePicker
                        onChange={this.setDate}
                        value={notifDate}
                        mode={Platform.OS === 'android' ? mode : 'datetime'}
                        is24Hour={true}
                        display="default"
                        minimumDate={minDate}
                      />
                    )}
              </View>
            </View>
            {this.state.notifDate.getDate() === new Date().getDate() ? (
              <Text style={styles.notificationText}>
                We'll send you a notification
              </Text>
            ) : (
              <Text style={styles.notificationText}>
                We'll send you a notification {'\n'} on {notificationDate}
              </Text>
            )}
            <TouchableOpacity
              style={
                this.state.canSubmit
                  ? styles.big_button
                  : {...styles.big_button, ...styles.buttonDisabled}
              }
              onPress={() =>
                this.scheduleNotif(
                  this.state.notifDate,
                  this.state.notifMessage,
                )
              }
              disabled={this.state.canSubmit ? false : true}>
              <Text style={styles.button_text}>Add item to planning</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    paddingBottom: 30,
    flex: 1,
  },
  iosDatePicker: {marginTop: 15},
  touchableWithoutFeedback: {
    paddingHorizontal: 20,
    flex: 1,
    display: 'flex',
    justifyContent: 'space-between',
  },
  firstInput: {
    marginBottom: 25,
  },
  inputLabel: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    color: '#44234C',
    fontSize: 15,
  },
  notificationText: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
    color: '#44234C',
    fontSize: 16,
    textAlign: 'center',
  },
  big_button: {
    borderWidth: 2,
    borderColor: '#44234C',
    borderRadius: 5,
    width: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7.5,
    paddingBottom: 12.5,
    alignSelf: 'center',
  },
  buttonDisabled: {
    opacity: 0.2,
  },
  button_text: {
    color: '#44234C',
    fontSize: 25,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: '#44234C',
    marginTop: 10,
    fontSize: 17.5,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
  },
  formTitle: {
    fontSize: 20,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    color: '#44234C',
    marginBottom: 15,
  },
  formContainer: {
    marginTop: 15,
  },
  goBackText: {
    color: '#44234C',
    fontSize: 15,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-regular' : 'Didot',
    textAlign: 'right',
  },
  goBack: {
    borderWidth: 1,
    borderColor: '#44234C',
    borderRadius: 5,
    width: 100,
    marginTop: 15,
    marginBottom: 25,
    paddingVertical: 5,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goBackArrow: {
    width: 12.5,
    height: 12.5,
    resizeMode: 'contain',
    marginTop: 3,
  },
});

export default Addplanning;
