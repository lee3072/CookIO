import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import 'firebase/firestore';

const CommentCard = ({ navigation, item }) => {
  // console.log("in comment card " + item.Content);
  return (
    // <TouchableOpacity
    //   onPress={() =>
    //     navigation.navigate('ListPostPage', { document: item.ID })
    //   }
    //   style={[styles.container]}
    // >
    
      <Text >{item.Content}</Text>
    // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 28,
    width: 300,
    fontSize: 25
  },
});

export default CommentCard;
