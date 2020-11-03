import React from "react";
import 'firebase/firestore';
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import InfiniteScroll from "../components/InfiniteScroll"

const ListTopicPage = ({ navigation }) => {
  return(
    <View>
      <Button color="#ffb300"
          title="My Profile"
          onPress={() => navigation.navigate('ProfilePage')}
      />
      <ScrollView>
        <InfiniteScroll title={'list topic page'} navigation={navigation} collection={"Tags"} card={"TagCard"} sortBy={"ID"}/>
      </ScrollView>
    </View>
  );
}

export default ListTopicPage;
