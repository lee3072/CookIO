import { database } from "firebase";
import React, { Component, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import PostCard from "../components/PostCard";
import 'firebase/firestore';
import firebase from '../../firebase_setup';
import InfiniteScroll from "../components/InfiniteScroll"

const FeedPage = ({ navigation }) => {
  return(<InfiniteScroll navigation={navigation} collection={"Posts"} card={"PostCard"} sortBy={"ID"}/>);
}



export default FeedPage;
