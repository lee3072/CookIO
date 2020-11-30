import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
const UserCard = ({ navigation, item }) => {
function getUserName(documentSnapshot) {
  return documentSnapshot.get('userName');
}
  return (
    <TouchableOpacity
      onPress={() =>{
        firebase.firestore().collection('Users')
        .doc(item.ID)
        .get()
        .then(document => {
          if (!document.data().followingOnlyMod || document.data().followingUsers.indexOf(firebase.auth().currentUser.uid) != -1) {
            if (document.data().blockedUsers.indexOf(firebase.auth().currentUser.uid) == -1) {
              firebase.firestore().collection('Users')
              .doc(firebase.auth().currentUser.uid)
              .get()
              .then(doc => {
                navigation.navigate('DirectMessageUserPage', { otheruser: item.ID, username: doc.data().userName, icon: doc.data().userIcon != null ? doc.data().userIcon : require("../assets/favicon.png") })
              })
            } else {
              Alert.alert("You Are Blocked by The User")
            }
          } else {
            Alert.alert("The User Only Accepts Messages from Following Users")
          }
        })
      }}
      style={[styles.container]}
    >
        <Text style={styles.title}>
            <Image
                style={styles.icon}
                source={
                    item.userIcon
                        ? { uri: item.userIcon }
                        : require("../assets/temp_icon.jpg")}/>
        {"  "+item.userName}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    container: {
        borderColor: "#000000",
        borderWidth: 0.5,
        
    },
    icon: {
      width: 60,
      height: 60,
    },
    title: {
        marginTop: 0,
        marginBottom: 10,
        marginHorizontal: 10,
        paddingTop:0,
        fontFamily: "Merriweather",
        color: "#121212",
        height: 80,
        fontSize: 25,
    },
});

export default UserCard;
