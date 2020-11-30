import { database } from "firebase";
import React, { Component, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button, Platform } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import PostCard from "../components/UserCard";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import InfiniteScroll from "../components/InfiniteScroll"
class DirectMessageMainPage extends React.Component {
    constructor(props){
      super (props);
    }
    render(){
      return (
        <View style={{paddingTop: (Platform.OS === 'ios') ? 40: 0}}>
          <View style={{
            borderTopWidth: (Platform.OS === 'ios') ? 2 : 0,
            borderBottomWidth: (Platform.OS === 'ios') ? 2 : 0,
            marginVertical: (Platform.OS === 'ios') ? 2 : 0,
            borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
          }}>
            <Button color="#ffb300"
                title="My Profile"
                onPress={() => this.props.navigation.navigate('ProfilePage')}
            />
          </View>
          <ScrollView>
            <InfiniteScroll title={'DM User'} navigation={this.props.navigation} collection={"Users"} card={"UserCard"} what={"id"} contain={this.props.route.params.dm} sortBy={"userEmail"}/>
            <InfiniteScroll title={'All User'} navigation={this.props.navigation} collection={"Users"} card={"UserCard"} sortBy={"userEmail"}/>
          </ScrollView>
        </View>
      );
    }
  }


export default DirectMessageMainPage;
