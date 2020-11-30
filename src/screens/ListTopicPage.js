import React from "react";
import 'firebase/firestore';
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import InfiniteScroll from "../components/InfiniteScroll"

const ListTopicPage = ({ navigation }) => {
  return(
    <View style={{paddingTop: (Platform.OS === 'ios') ? 40: 0}}>
      <View style={{
        borderTopWidth: (Platform.OS === 'ios') ? 2 : 0,
        borderBottomWidth: (Platform.OS === 'ios') ? 2 : 0,
        marginVertical: (Platform.OS === 'ios') ? 2 : 0,
        borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
      }}>
        <Button color="#ffb300"
            title="My Profile"
            onPress={() => navigation.navigate('ProfilePage')}
        />
      </View>
      <ScrollView>
        <InfiniteScroll title={'list topic page'} navigation={navigation} collection={"Tags"} card={"TagCard"} sortBy={"ID"}/>
      </ScrollView>
    </View>
  );
}

export default ListTopicPage;
