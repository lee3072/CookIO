import React from "react";
import 'firebase/firestore';
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import InfiniteScroll from "../components/InfiniteScroll"

const GuestViewPage = ({ navigation }) => {
  return(
    <View>
      <View style={{
        borderTopWidth: (Platform.OS === 'ios') ? 2 : 0,
        borderBottomWidth: (Platform.OS === 'ios') ? 2 : 0,
        marginVertical: (Platform.OS === 'ios') ? 2 : 0,
        borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white",
        marginTop: (Platform.OS === 'ios') ? 40 : 10,
      }}>
        <Button color="#ffb300"
            title="Sign In"
            onPress={() => navigation.navigate('SignInPage')}
        />
      </View>
      <ScrollView>
        <InfiniteScroll title={'list post page'} navigation={navigation} collection={"Posts"} card={"PostCard"} sortBy={"PostedDate"}/>
      </ScrollView>
    </View>
  );
}

export default GuestViewPage;
