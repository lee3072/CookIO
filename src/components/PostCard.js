import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import 'firebase/firestore';
import PostView from "../screens/PostView";


// class PostCard extends React.Component {
//   constructor(props){
//     super(props);
//   }

//   render(){
const PostCard = ({ navigation, item }) => {
  console.log("in post card" + item.id);
  console.log(item.ID);
  return (
    <TouchableOpacity 
      onPress={() =>
          navigation.navigate('PostView', {id: item.ID})
      }
      style={[styles.container]}
      >

      <Text style={styles.title}>{item.id}</Text>
      <Text style={styles.tages3}>tages</Text>
      <Text style={styles.tages1}>
        content:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx...
      </Text> 
      <View style={styles.rectRow}>
        <View style={styles.rect}></View>
        <View style={styles.rect1}></View>
        <View style={styles.rect2}></View>
      </View>
    </TouchableOpacity>
    );
}


//   }
  
// }

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
