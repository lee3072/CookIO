import React from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, SafeAreaView, Image } from "react-native";
import 'firebase/firestore';


const PostCard = ({ navigation, item }) => {
  console.log("in post card " + item.ID);
  console.log("see userid: " + item.PostedUser);
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('UserFeedPage', {userid: item.PostedUser })}
        style={[styles.container]}><Text style={styles.tages3}>{item.PostedUser}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PostView', { id: item.ID })
      }
      style={[styles.container]}
    >
    <Text style={styles.title}>{item.Title}</Text>
    <Text style={styles.tages3}>{"tag:"+item.Tag}</Text>
    <Text style={styles.tages1}>
      {"content:"+item.Content}
    </Text>
    <View style={styles.imageView}>
    <Image
      style={styles.icon}
      source={
          item.Image
              ? { uri: item.Image }
              : require("../assets/temp_icon.jpg")}/>
    </View>
    </TouchableOpacity>
    </SafeAreaView>
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
  icon: {
    width: 160,
    height: 160,
  },
  imageView: {
    paddingTop: -10,
    padding: 0,
    marginTop: 0,
    marginBottom: 40,
    marginHorizontal: 10,
    width: 160,
    height: 160,
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
    fontSize: 15,
  },
});

export default PostCard;
