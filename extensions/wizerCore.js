import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from '../config/Firebase/firebaseConfig';
import PushNotification from 'react-native-push-notification';

firebase.initializeApp(firebaseConfig.firebase);

export const Firebase = {
  // loginWithGoogle: token => {
  //   console.log('google token: ', token);
  //   const credential = firebase.auth.GoogleAuthProvider.credential(token);
  //   console.log('google credential: ', credential);
  // },
  loginWithFacebook: token => {
    const credential = firebase.auth.FacebookAuthProvider.credential(token);
    return firebase.auth().signInWithCredential(credential);
  },
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },
  signOut: () => {
    return firebase.auth().signOut();
  },
  checkUserAuth: user => {
    return firebase.auth().onAuthStateChanged(user);
  },
  createNewUser: userData => {
    return firebase
      .firestore()
      .collection('users')
      .doc(`${userData.uid}`)
      .set(userData);
  },
  addUserData: (userId, userData) => {
    return firebase
      .database()
      .ref('users/' + userId)
      .set(userData);
  },
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },
  getCurrentUserId: () => {
    return firebase.auth().currentUser.uid;
  },
  addPlanningItem: (data, userId) => {
    return firebase
      .database()
      .ref('users/' + userId + '/planning')
      .push(data);
  },
  addPastItem: (userId, data) => {
    return firebase
      .database()
      .ref('users/' + userId + '/pastItems')
      .push(data);
  },
  getCurrentUserName: userId => {
    return firebase
      .database()
      .ref('users/' + userId + '/username')
      .once('value');
  },
  getCurrentUserWithId: userId => {
    return firebase
      .database()
      .ref('users/' + userId)
      .once('value');
  },
  getPlanningUser: userId => {
    return firebase
      .database()
      .ref('users/' + userId + '/planning')
      .orderByChild('sortDate')
      .once('value', function(snap) {
        let items = [];
        snap.forEach(function(item) {
          const key = item.key;
          const toAdd = {item, key};
          items.push(toAdd);
        });
      });
  },
  getPastPlanningUser: userId => {
    return firebase
      .database()
      .ref('users/' + userId + '/pastItems')
      .once('value', function(snap) {
        let items = [];
        snap.forEach(function(item) {
          const key = item.key;
          const toAdd = {item, key};
          items.push(toAdd);
        });
      });
  },
  removePlanningItem: (userId, itemId) => {
    return firebase
      .database()
      .ref('users/' + userId + '/planning/' + itemId)
      .remove();
  },
  removePastItem: (userId, itemId) => {
    return firebase
      .database()
      .ref('users/' + userId + '/pastItems/' + itemId)
      .remove();
  },
};

export const NotificationService = class NotifService {
  constructor(onRegister, onNotification) {
    this.configure(onRegister, onNotification);
  }
  configure(onRegister, onNotification, gcm = '') {
    PushNotification.configure({
      onRegister: onRegister,
      onNotification: onNotification,
      senderID: gcm,
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: true,
    });
  }
  localNotif(message) {
    PushNotification.localNotification({
      message: message,
    });
  }
  scheduleNotif(
    notifTime,
    notifMessage,
    notifNumber = Math.floor(Math.random() * Math.floor(100000000)),
  ) {
    PushNotification.localNotificationSchedule({
      id: notifNumber,
      message: notifMessage,
      date: notifTime,
      userInfo: {id: notifNumber},
    });
  }
  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }
  cancelNotif(number) {
    PushNotification.cancelLocalNotifications({
      id: number,
    });
  }
};
