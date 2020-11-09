import React from "react";
import 'firebase/firestore';
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import InfiniteScroll from "../components/InfiniteScroll"

const GuestViewPage = ({ navigation }) => {
  return(
    <View>
      <Button color="#ffb300"
          title="Sign In"
          onPress={() => navigation.navigate('SignInPage')}
      />
      <ScrollView>
        <InfiniteScroll title={'list post page'} navigation={navigation} collection={"Posts"} card={"PostCard"} sortBy={"PostedDate"}/>
      </ScrollView>
    </View>
  );
}

export default GuestViewPage;
