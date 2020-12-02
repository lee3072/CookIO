import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import 'firebase/firestore';
import firebase from '../../firebase_setup';

const CommentCard = ({ navigation, item }) => {
  // console.log("in comment card " + item.Content);
  let timeStemp = new Date(item.Date)
  let displayTime = timeStemp.toLocaleString()
  
  return (
    // <TouchableOpacity
    //   onPress={() =>
    //     navigation.navigate('ListPostPage', { document: item.ID })
    //   }
    //   style={[styles.container]}
    // >
    <View style={styles.container}>
      <Text style={styles.userName}>{item.ByUserID}</Text>
      <Text style={styles.content}>{item.Content}</Text>
      <Text style={styles.date}>{displayTime}</Text>
    </View>
    // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  userName: {
    // fontFamily: "Merriweather",
    color: "#575757",
    height: 28,
    width: 300,
    fontSize: 20
  },
  date: {
    // fontFamily: "Merriweather",
    color: "#999999",
    height: 28,
    width: 300,
    fontSize: 12
  },
  content: {
    // fontFamily: "Merriweather",
    color: "#000000",
    height: 28,
    width: 300,
    fontSize: 20
  },
});

export default CommentCard;
