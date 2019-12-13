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
import {Firebase} from '../extensions/wizerCore';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      refreshing: false,
      pastItems: [],
    };
  }

  componentDidMount() {
    this.getPastPlanning();
  }

  getPastPlanning = async () => {
    let pastData = await AsyncStorage.getItem('pastPlanning');
    if (pastData !== null) {
      this.setState({pastItems: JSON.parse(pastData)});
    }
  };

  onRefresh = () => {
    this.getPastPlanning();
  };

  reloadPastPlanning = async () => {
    const pastList = [];
    const currentUserId = await Firebase.getCurrentUserId();
    const pastData = await Firebase.getPastPlanningUser(currentUserId);
    pastData.forEach(pastItem => {
      const pastKey = pastItem.key;
      const pastItemString = JSON.stringify(pastItem);
      const pastItemArray = JSON.parse(pastItemString);
      const pastMessage = pastItemArray.pastItemMessage;
      const pastDate = pastItemArray.pastItemDate;
      const toAddPastItem = {
        pastKey,
        pastMessage,
        pastDate,
      };
      pastList.push(toAddPastItem);
    });
    await AsyncStorage.setItem('pastPlanning', JSON.stringify(pastList));
  };

  handleRemoveItem = async item => {
    const currentUserId = await Firebase.getCurrentUserId();
    await Firebase.removePastItem(currentUserId, item.pastKey);
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
            <ScrollView
              style={styles.scrollview}
              refreshControl={
                <RefreshControl
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
                <>
                  <Text>
                    Here you find your planning items that have been done, are
                    you ready to get rid of them forever?
                  </Text>
                  <PastPlanning
                    data={this.state.pastItems}
                    handleRemoveItem={this.handleRemoveItem}
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
    backgroundColor: '#44234C',
  },
  hideStatusBar: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    flex: 1,
    marginHorizontal: 20,
  },
  flexshrink: {flexShrink: 1},
  scrollview: {height: '70%'},
  planningWrapper: {
    display: 'flex',
    height: '100%',
    justifyContent: 'space-between',
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
  planningHelp: {
    fontFamily:
      Platform.OS === 'android' ? 'Playfair-Display-italic' : 'Didot-Italic',
    color: '#44234C',
    textAlign: 'center',
    marginTop: 30,
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

export default Home;
