import React, { Component } from "react";
import { StyleSheet, Text, View } from 'react-native';

import firebase from '../../firebase_setup';



import CupertinoHeaderWithActionButton from "../components/CupertinoHeaderWithActionButton";


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