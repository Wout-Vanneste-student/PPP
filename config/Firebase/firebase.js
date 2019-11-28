import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const Firebase = {
  // auth
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
      .collection("users")
      .doc(`${userData.uid}`)
      .set(userData);
  },
  addUserData: (userId, userData) => {
    return firebase
      .database()
      .ref("users/" + userId)
      .set(userData);
  },
  getCurrentUser: () => {
    return firebase.auth().currentUser;
  },
  getCurrentUserId: () => {
    return firebase.auth().currentUser.uid;
  },
  addPushToken: (token, userId) => {
    return firebase
      .database()
      .ref("users/" + userId + "/push_token")
      .set(token);
  },
  getCurrentUserName: userId => {
    return firebase
      .database()
      .ref("users/" + userId + "/username")
      .once("value");
  },
  getCurrentUserWithId: userId => {
    return firebase
      .database()
      .ref("users/" + userId)
      .once("value");
  }
};

export default Firebase;
