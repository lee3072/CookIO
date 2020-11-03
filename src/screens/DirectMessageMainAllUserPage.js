import { database } from "firebase";
import React, { Component, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import PostCard from "../components/UserCard";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import InfiniteScroll from "../components/InfiniteScroll"
import { SafeAreaView } from "react-native-safe-area-context";
class DirectMessageMainAllUserPage extends React.Component {
    constructor(props){
      super (props);
    }
    render(){
      return (
        <View>
          <Button color="#ffb300"
              title="My Profile"
              onPress={() => this.props.navigation.navigate('ProfilePage')}
          />
          <ScrollView>
            <InfiniteScroll title={'DM page'} navigation={this.props.navigation} collection={"Users"} card={"UserCard"} sortBy={"userEmail"}/>
          </ScrollView>
        </View>
      );
    }
  }


export default DirectMessageMainAllUserPage;
