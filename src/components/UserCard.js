import React from "react";
import { Image, StyleSheet, View, Text, TouchableOpacity } from "react-native";
import 'firebase/firestore';

const UserCard = ({ navigation, item }) => {
//   console.log("in post card " + item.ID);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('DirectMessageUserPage', { otheruser: item.id, icon: item.userIcon ? item.userIcon : require("../assets/favicon.png") })
      }
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
