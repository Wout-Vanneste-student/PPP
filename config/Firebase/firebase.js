import * as firebase from 'firebase';
import 'firebase/auth';
import 'firebase/firestore';
import firebaseConfig from './firebaseConfig';

// Initialize Firebase
firebase.initializeApp(firebaseConfig.firebase);

var provider = new firebase.auth.FacebookAuthProvider();

provider.addScope('email, first_name');

provider.setCustomParameters({display: 'popup'});

firebase.auth().useDeviceLanguage();

const Firebase = {
  // auth
  loginWithFacebook: () => {
    return firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => {
        console.log('result: ', result);
        // var token = result.credential.accessToken;
        // console.log('token: ', token);
        // var user = result.user;
        // console.log('user: ', user);
      })
      .catch(error => {
        console.log('error: ', error);
        var errorCode = error.code;
        console.log('errorCode: ', errorCode);
        var errorMessage = error.message;
        console.log('errorMessage: ', errorMessage);
        var email = error.email;
        console.log('email: ', email);
        var credential = error.credential;
        console.log('credential: ', credential);
      });
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
  addKeyToItem: (notifKey, date, message, item, userId) => {
    return firebase
      .database()
      .ref('users/' + userId + '/planning/' + item)
      .set({notifKey: notifKey, notifDate: date, notifMessage: message});
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
      .orderByChild('time')
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
};

export default Firebase;
