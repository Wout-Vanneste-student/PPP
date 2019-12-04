import React, { Component } from "react";
import DatePicker from "react-native-datepicker";
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
  AsyncStorage
} from "react-native";
import * as Font from "expo-font";
import firebase from "../config/Firebase";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";

class Addplanning extends Component {
  constructor() {
    super();
    this.state = {
      itemTitle: "",
      itemTime: "",
      canSubmit: false,
      planningAdded: false
    };
  }
  static navigationOptions = {
    header: null
  };

  componentDidMount() {
    this.retrieveData();
  }

  scheduleNotification = async (date, body) => {
    let sendSecondNot = false;
    let currentDate = new Date(),
      currentDay = "" + (currentDate.getDate() + 1);
    if (currentDay.length < 2) currentDay = "0" + currentDay;
    const parDate = date;
    const parBody = body;
    const year = parDate.substring(0, 4);
    const month = parDate.substring(5, 7);
    const day = parDate.substring(8, 10);

    if (currentDay !== day) {
      sendSecondNot = true;
    }

    const notifDate = new Date(year, month - 1, day, "07", "00");

    const schedulingOptions = {
      time: notifDate.getTime()
    };

    const localNotification = {
      title: "Planned for today",
      body: parBody
    };

    const response1 = await Notifications.scheduleLocalNotificationAsync(
      localNotification,
      schedulingOptions
    );
    this.addNotificationId(response1);
    if (sendSecondNot === true) {
      // const secondDate = new Date(year, month - 1, day - 1, "07", "00");
      // const secondSchedulingOptions = {
      //   time: secondDate.getTime()
      // };
      // const secondLocalNotification = {
      //   title: "Planned for tomorrow",
      //   body: parBody
      // };
      // const response2 = await Notifications.scheduleLocalNotificationAsync(
      //   secondLocalNotification,
      //   secondSchedulingOptions
      // );
      // this.addNotificationId(response2);
    }
  };

  addNotificationId = async notification => {
    const title = this.state.itemTitle;
    const time = this.state.itemTime;
    const planningData = { notification, title, time };
    this.currentUserId = await firebase.getCurrentUserId();
    try {
      const response = await firebase.addPlanningItem(
        planningData,
        this.currentUserId
      );
      if (response) {
        this.setState({ planningAdded: true });
      }
    } catch (error) {
      console.log(error);
    } finally {
      if (this.state.planningAdded === true) {
        const dataList = [];
        const data = await firebase.getPlanningUser(this.currentUserId);
        data.forEach(item => {
          const key = item.key;
          const itemStringify = JSON.stringify(item);
          const itemArray = JSON.parse(itemStringify);
          const time = itemArray.time;
          const title = itemArray.title;
          const notification = itemArray.notification;
          const toAddItem = { key, notification, time, title };
          dataList.push(toAddItem);
        });
        AsyncStorage.removeItem("userPlanning");
        AsyncStorage.setItem("userPlanning", JSON.stringify(dataList));
        const { navigate } = this.props.navigation;
        navigate("Planning");
      }
    }
  };

  addPlanningItem = async () => {
    const title = this.state.itemTitle;
    const time = this.state.itemTime;
    await this.scheduleNotification(time, title);
  };

  handleCheckText = () => {
    if (this.state.itemTitle !== "" && this.state.itemTime !== "") {
      this.setState({ canSubmit: true });
    } else {
      this.setState({ canSubmit: false });
    }
  };

  handleCheckDate = date => {
    this.setState({ itemTime: date });
    if (this.state.itemTitle !== "" && this.state.itemTime !== "") {
      this.setState({ canSubmit: true });
    } else {
      this.setState({ canSubmit: false });
    }
  };

  retrieveData = async () => {
    await Font.loadAsync({
      "Customfont-Regular": require("../assets/fonts/Customfont-Regular.ttf"),
      "Customfont-Italic": require("../assets/fonts/Customfont-Italic.ttf"),
      "Customfont-Bold": require("../assets/fonts/Customfont-Bold.ttf")
    });
    this.setState({ fontLoaded: true });
  };

  render() {
    const { navigate } = this.props.navigation;
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + (d.getDate() + 1),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    // You can only set something for the day after the current date
    // As you need to receive a notification on the day of the due date at 7:00 AM
    const minDate = [year, month, day].join("-");

    return (
      <SafeAreaView style={styles.hideStatusBar}>
        <View style={styles.formContainer}>
          <TouchableOpacity
            style={styles.goBack}
            onPress={() => navigate("Planning")}
          >
            <Image
              style={styles.goBackArrow}
              source={require("../assets/img/arrow.png")}
            ></Image>
            <Text style={styles.goBackText}>Go back</Text>
          </TouchableOpacity>
          <Text style={styles.formTitle}>Add something to your planning</Text>
          <View style={styles.firstInput}>
            <Text style={styles.inputLabel}>What do you want to plan?</Text>
            <TextInput
              style={styles.textInput}
              onEndEditing={this.handleCheckText}
              onChangeText={itemTitle => this.setState({ itemTitle })}
              value={this.state.itemTitle}
            ></TextInput>
          </View>
          <View>
            <Text style={styles.inputLabel}>Set a due date</Text>
            <DatePicker
              date={this.state.itemTime}
              style={{ width: 200 }}
              mode="date"
              placeholder="select date"
              format="YYYY-MM-DD"
              minDate={minDate}
              maxDate="2020-12-31"
              iconSource={require("../assets/img/calendar.png")}
              customStyles={{
                placeholderText: {
                  fontFamily: "Customfont-Regular",
                  fontSize: 17.5
                },
                dateText: {
                  fontFamily: "Customfont-Regular",
                  fontSize: 17.5,
                  color: "#44234C"
                },
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0
                },
                dateInput: {
                  borderWidth: 2,
                  borderColor: "#44234C",
                  borderRadius: 5,
                  paddingHorizontal: 20,
                  paddingTop: 10,
                  paddingBottom: 15,
                  marginLeft: 40
                }
              }}
              onDateChange={date => this.handleCheckDate(date)}
            />
          </View>
        </View>
        <Text style={styles.inputLabel}>
          We'll send you a notification the day before (unless due date is
          tomorrow) and on the due date at 7:00 AM.
        </Text>
        <TouchableOpacity
          style={
            this.state.canSubmit
              ? styles.big_button
              : { ...styles.big_button, ...styles.buttonDisabled }
          }
          onPress={() => this.addPlanningItem()}
          disabled={this.state.canSubmit ? false : true}
        >
          <Text style={styles.button_text}>Add item to planning</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 50,
    paddingHorizontal: 15,
    flex: 1,
    display: "flex",
    justifyContent: "space-between"
  },
  firstInput: {
    marginBottom: 25
  },
  inputLabel: {
    fontFamily: "Customfont-Regular",
    color: "#44234C",
    fontSize: 15
  },
  big_button: {
    borderWidth: 2,
    borderColor: "#44234C",
    borderRadius: 5,
    width: 300,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 7.5,
    paddingBottom: 12.5,
    alignSelf: "center"
  },
  buttonDisabled: {
    opacity: 0.2
  },
  button_text: {
    color: "#44234C",
    fontSize: 25,
    fontFamily: "Customfont-Bold"
  },
  textInput: {
    borderBottomWidth: 2,
    borderBottomColor: "#44234C",
    width: 300,
    marginTop: 10,
    fontSize: 17.5,
    fontFamily: "Customfont-Regular"
  },
  formTitle: {
    fontSize: 20,
    fontFamily: "Customfont-Regular",
    color: "#44234C",
    marginBottom: 15
  },
  formContainer: {
    marginTop: 15
  },
  goBackText: {
    color: "#44234C",
    fontSize: 15,
    fontFamily: "Customfont-Regular",
    textAlign: "right"
  },
  goBack: {
    borderWidth: 1,
    borderColor: "#44234C",
    borderRadius: 5,
    width: 100,
    marginTop: 15,
    marginBottom: 25,
    paddingVertical: 5,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  goBackArrow: {
    width: 12.5,
    height: 12.5,
    resizeMode: "contain",
    marginTop: 3
  }
});

export default Addplanning;
