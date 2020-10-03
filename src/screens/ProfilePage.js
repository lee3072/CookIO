import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import firebase from '../../firebase_setup';
//import * as firebase from "firebase";

/*
var firebaseConfig = {
    apiKey: "AIzaSyC1vzo3Uk66RrEtkxRaUKzln93sppXtPGs",
    authDomain: "cookio-b4eaa.firebaseapp.com",
    databaseURL: "https://cookio-b4eaa.firebaseio.com",
    projectId: "cookio-b4eaa",
    storageBucket: "cookio-b4eaa.appspot.com",
    messagingSenderId: "244962151899",
    appId: "1:244962151899:web:46d43e6bdf48777df1ebfe"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
*/


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log(user.email)
    } else {
      // No user is signed in.
      console.log("Not logged-in")
    }
  });


class ProfilePage extends React.Component {


    render() {
        return (
            <View
                style={{
                lex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text>Hello, world!</Text>
            </View>
        );
    }
}

// ...

export default ProfilePage;