import { database } from "firebase";
import React, { Component, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import PostCard from "../components/UserCard";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import InfiniteScroll from "../components/InfiniteScroll"
class DirectMessageMainAllUserPage extends React.Component {
    constructor(props){
      super (props);
    }
    render(){
      return (
        <InfiniteScroll title={'DM page'} navigation={this.props.navigation} collection={"Users"} card={"UserCard"} sortBy={"userEmail"}/>
      );
    }
  }


export default DirectMessageMainAllUserPage;
