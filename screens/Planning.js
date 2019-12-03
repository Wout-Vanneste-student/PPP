import React, { Component } from "react";
import {
  Text,
  SafeAreaView,
  View,
  Image,
  Platform,
  StatusBar,
  StyleSheet,
  AsyncStorage,
  TouchableOpacity,
  ScrollView
} from "react-native";
import { Notifications } from "expo";
import * as Permissions from "expo-permissions";
import Firebase from "../config/Firebase";
import * as Font from "expo-font";

class Planning extends Component {
  constructor() {
    super();
    this.state = {
      fontLoaded: false,
      userPlanning: []
    };
  }
  static navigationOptions = {
    header: null
  };

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      return;
    }
    try {
      this.currentUserToken = await Notifications.getExpoPushTokenAsync();
      this.currentUserId = await Firebase.getCurrentUserId();
      Firebase.addPushToken(this.currentUserToken, this.currentUserId);
    } catch (error) {
      console.log("error: ", error);
    }
  };

  getPlanning = async () => {
    const dataList = await AsyncStorage.getItem("userPlanning");
    if (dataList !== null) {
      this.setState({ userPlanning: dataList });
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
    const data = await Firebase.getPlanningUser(this.currentUserId);
    data.forEach(item => {
      const key = item.key;
      const itemData = JSON.stringify(item);
      const dataLength = itemData.length;
      const time = itemData.substring(9, 19);
      const title = itemData.substring(30, dataLength - 2);
      const toAddItem = { key, time, title };
      dataList.push(toAddItem);
    });
    AsyncStorage.removeItem("userPlanning");
    AsyncStorage.setItem("userPlanning", JSON.stringify(dataList));
    await this.getPlanning();
  };

  retrieveData = async () => {
    await this.registerForPushNotificationsAsync();
    await Font.loadAsync({
      "Customfont-Regular": require("../assets/fonts/Customfont-Regular.ttf"),
      "Customfont-Italic": require("../assets/fonts/Customfont-Italic.ttf"),
      "Customfont-Bold": require("../assets/fonts/Customfont-Bold.ttf")
    });
    await this.getPlanning();
    this.setState({ fontLoaded: true });
  };

  handleRemovePlanningItem = async item => {
    await Firebase.removePlanningItem(this.currentUserId, item.key);
    this.reloadPlanningAfterRemove();
  };

  render() {
    const { navigate } = this.props.navigation;
    return this.state.fontLoaded === false ||
      this.state.userPlanning === [] ? null : (
      <SafeAreaView style={styles.hideStatusBar}>
        <View>
          <View style={styles.topFlex}>
            <Image
              source={require("../assets/img/wizer_dark.png")}
              style={styles.brandingImage}
            ></Image>
            <Text style={styles.headerText}>Your planning</Text>
          </View>
          <ScrollView style={{ height: "70%" }}>
            <UserPlanning
              style={styles.userPlanning}
              data={this.state.userPlanning}
              handleRemovePlanningItem={this.handleRemovePlanningItem}
            />
          </ScrollView>
          <Text style={styles.planningHelp}>
            You can scroll through your planning.
          </Text>
        </View>
        <TouchableOpacity
          style={styles.big_button}
          onPress={() => navigate("Addplanning")}
        >
          <Text style={styles.button_text}>Add item to planning</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const UserPlanning = ({ data, handleRemovePlanningItem }) => {
  const list = JSON.parse(data);

  return (
    <>
      {list.map((item, i) => {
        return (
          <View style={styles.planningItem} key={i}>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemovePlanningItem(item)}
            >
              <Text>REM</Text>
            </TouchableOpacity>
            <View>
              <Text style={styles.planningDate}>{item.time}</Text>
              <Text style={styles.planningText}>Task: {item.title}</Text>
            </View>
          </View>
        );
      })}
    </>
  );
};

const styles = StyleSheet.create({
  hideStatusBar: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    paddingBottom: 50,
    paddingHorizontal: 15,
    flex: 1,
    display: "flex",
    justifyContent: "space-between"
  },
  planningHelp: {
    fontFamily: "Customfont-Italic",
    color: "#44234C",
    textAlign: "center",
    marginVertical: 10
  },
  customfont: {
    fontFamily: "Customfont-Regular",
    color: "#44234C"
  },
  headerText: {
    fontFamily: "Customfont-Regular",
    fontSize: 25,
    color: "#44234C"
  },
  brandingImage: {
    width: 90,
    height: 30,
    resizeMode: "contain"
  },
  topFlex: {
    paddingVertical: 20,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row"
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
  planningItem: {
    marginBottom: 25,
    display: "flex",
    flexDirection: "row"
  },
  planningDate: {
    color: "#44234C",
    fontFamily: "Customfont-Italic"
  },
  planningText: {
    color: "#44234C",
    fontFamily: "Customfont-Regular",
    fontSize: 17.5
  },
  removeButton: {
    borderColor: "red",
    borderWidth: 1,
    marginRight: 15
  }
});

export default Planning;
