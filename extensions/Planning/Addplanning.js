import React, {Component} from 'react';
import {
  Text,
  View,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {Firebase, NotificationService} from '../wizerCore';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePicker from 'react-native-modal-datetime-picker';

class Addplanning extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifMessage: '',
      canSubmit: false,
      planningAdded: false,
      notifKeySet: false,
      isDateTimePickerVisible: false,
      notifDate: null,
      minDate: new Date(new Date().setDate(new Date().getDate())),
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
    const currentUserId = await AsyncStorage.getItem('currentUserId');
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
      const response = await Firebase.addPlanningItem(
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
        AsyncStorage.removeItem('userPlanning');
        AsyncStorage.setItem('userPlanning', JSON.stringify(dataList));
        const roundSecondsDate = new Date(new Date(date).setSeconds(0));
        const uniqueKey = JSON.stringify(notifKey);
        this.notif.scheduleNotif(roundSecondsDate, message, uniqueKey);
        this.props.action();
      }
    }
  };

  handleCheckText = () => {
    if (this.state.notifDate !== null) {
      this.setState({canSubmit: true});
    } else {
      this.setState({canSubmit: false});
    }
    this.setState({canSubmit: true});
  };

  handleChangeText = notifMessage => {
    this.setState({notifMessage});
    if (this.state.notifDate !== null) {
      this.setState({canSubmit: true});
    }
  };
  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };
  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    this.setState({notifDate: date});
    this.hideDateTimePicker();
  };
  render() {
    const {canSubmit, notifDate, minDate} = this.state;
    let notificationDate = '';
    if (notifDate !== null) {
      if (notifDate.getDate() !== null) {
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
    }

    return (
      <View style={styles.addContainer}>
        <TouchableWithoutFeedback
          style={styles.flex}
          onPress={Keyboard.dismiss}
          accessible={false}>
          <View style={styles.touchableWithoutFeedback}>
            <View style={styles.formContainer}>
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
                  onChangeText={notifMessage =>
                    this.handleChangeText(notifMessage)
                  }
                  value={this.state.notifMessage}
                />
              </View>
              <View>
                <View>
                  <TouchableOpacity
                    style={styles.date_button}
                    onPress={this.showDateTimePicker}>
                    <Text style={styles.date_button_text}>
                      Select date &amp; time
                    </Text>
                  </TouchableOpacity>
                </View>
                <DateTimePicker
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.hideDateTimePicker}
                  mode="datetime"
                  minimumDate={minDate}
                  titleIOS="Select a date &amp; time"
                />
              </View>
            </View>
            {notifDate === null ? (
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
                canSubmit
                  ? styles.big_button
                  : {...styles.big_button, ...styles.buttonDisabled}
              }
              onPress={() =>
                this.scheduleNotif(
                  this.state.notifDate,
                  this.state.notifMessage,
                )
              }
              disabled={canSubmit ? false : true}>
              <Text style={styles.button_text}>Add item to planning</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  flex: {flex: 1},
  addContainer: {
    flex: 1,
  },
  iosDatePicker: {marginTop: 15},
  touchableWithoutFeedback: {
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
      Platform.OS === 'android'
        ? 'Playfair-Display-italic'
        : Platform.OS === 'android'
        ? 'Playfair-Display-italic'
        : 'Didot-Italic',
    color: '#44234C',
    fontSize: 16,
    textAlign: 'center',
  },
  date_button: {
    backgroundColor: '#44234C',

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
  date_button_text: {
    color: 'white',
    fontSize: 25,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  big_button: {
    borderWidth: 2,
    borderColor: '#44234C',
    borderRadius: 5,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 7.5,
    paddingBottom: Platform.OS === 'android' ? 12.5 : 7.5,
    alignSelf: 'center',
    marginBottom: 25,
  },
  button_text: {
    color: '#44234C',
    fontSize: 25,
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-bold' : 'Didot-Bold',
  },
  buttonDisabled: {
    opacity: 0.2,
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
});

export default Addplanning;
