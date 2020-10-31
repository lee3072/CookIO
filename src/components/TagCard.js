import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import 'firebase/firestore';

const PostCard = ({ navigation, item }) => {
  // console.log("in tag card " + item.ID);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('ListPostPage', { document: item.ID })
      }
      style={[styles.container]}
    >
      <Text style={styles.title}>{item.ID}</Text>
    </TouchableOpacity>
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

export default PostCard;
