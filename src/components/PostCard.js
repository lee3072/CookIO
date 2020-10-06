import React, { Component, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import 'firebase/firestore';
import firebase from '../../firebase_setup';

function PostCard(props) {
  // const [title, setTitel] = useState('');
  // let db = firebase.firestore();
  // db.collection("Posts").doc(props.postID).get().then( postRef =>{
  //   setTitel(postRef.get("Title").toString())
  // })
  return (
    <View style={[styles.container, props.style]}>
      {/* <Text style={styles.title}>title</Text> */}
      <Text style={styles.title}>{props.item}</Text>
      <Text style={styles.tages3}>tages</Text>
      <Text style={styles.tages1}>
        content:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx...
      </Text>
      <View style={styles.rectRow}>
        <View style={styles.rect}></View>
        <View style={styles.rect1}></View>
        <View style={styles.rect2}></View>
      </View>
    </View>
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
  tages3: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 20,
    width: 300,
    fontSize: 15
  },
  tages1: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 60,
    width: 300,
    fontSize: 15
  },
  rect: {
    width: 100,
    height: 100,
    backgroundColor: "#E6E6E6"
  },
  rect1: {
    width: 100,
    height: 100,
    backgroundColor: "#E6E6E6"
  },
  rect2: {
    width: 100,
    height: 100,
    backgroundColor: "#E6E6E6"
  },
  rectRow: {
    height: 100,
    flexDirection: "row"
  }
});

export default PostCard;
