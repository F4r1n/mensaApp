import app from "firebase/app";
import 'firebase/auth'
import 'firebase/firestore'

const config = {
  apiKey: "AIzaSyAHSpIezC7Se3hkVAzBAzUQnZf7Rs6NFC8",
  authDomain: "mensa-app-16754.firebaseapp.com",
  databaseURL: "https://mensa-app-16754.firebaseio.com",
  projectId: "mensa-app-16754",
  storageBucket: "mensa-app-16754.appspot.com",
  messagingSenderId: "564211919681",
  appId: "1:564211919681:web:f63e86620affa08fcacfc0",
  measurementId: "G-5LV6BGF369"
}; 

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.firestore();
    this.users = this.db.collection('user')
    this.mensen = this.db.collection('mensa')
  }

  /**
   * USER FUNCTIONS
   */
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);
  
  /**
   * DATABASE FUNCTIONS
   */
  
  doPutUser = (email, user) =>
    this.users.doc(email).set(user)
  
  doGetUser = (email) => 
    this.users.doc(email).get()
      .then(doc => {
        if (!doc.exists) {
          console.log("Document does not exist.")
        } else {
          this.user = doc.data()
        }
      })
      .catch(err => {
        console.log(err)
      });
  
}

export default Firebase;