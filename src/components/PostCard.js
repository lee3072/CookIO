import React, {useState} from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, SafeAreaView, Image, Dimensions } from "react-native";

import 'firebase/firestore';


var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
const PostCard = ({ navigation, item }) => {
  // console.log("in post card " + item.ID);
  // console.log("see userid: " + item.PostedUser);
  var time = parseFloat(item.Date);
  
  let timeStemp = new Date(item.Date)
  let displayTime = timeStemp.toLocaleString()
  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.navigate('UserFeedPage', {userid: item.PostedUser })}
        ><Text style={styles.tages3}>{"Posted User: "+item.PostedUserName +" ("+displayTime+")"}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('PostView', { id: item.ID })
      }
      
    >
    <Text style={styles.title}>{item.Title}</Text>
    <Text style={styles.tages1}>
      {item.Content}
    </Text>
    <View style={styles.imageView}>
    <Image
      style={styles.icon}
      source={
        item.Image
        ? { uri: item.Image }
        : require("../assets/temp_icon.jpg")}/>
    </View>
    <Text style={styles.tages3}>{"tag:"+item.Tag}</Text>
    </TouchableOpacity>
    
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderColor: "#000000",
    borderTopWidth: 2.5,
    // borderBottomWidth: 2.5,
    marginBottom: 10,
  },
  title: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 28,
    width: 300,
    fontSize: 25
  },
  icon: {
    width: screenWidth,
    height: screenWidth/1.3,
  },
  imageView: {
    padding: 0,
    marginTop: 0,
    alignItems:"center"
  },
  tages3: {
    fontFamily: "Merriweather",
    color: "#121212",
    height: 20,
    // width: 300,
    fontSize: 15
  },
  tages1: {
    fontFamily: "Merriweather",
    color: "#121212",

    width: 300,
    fontSize: 15,
  },
});

export default PostCard;
