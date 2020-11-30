import React from "react";
import 'firebase/firestore';
import { StyleSheet, View, Alert, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import InfiniteScroll from "../components/InfiniteScroll"

import firebase from '../../firebase_setup';
import 'firebase/firestore';

var db = firebase.firestore(); //firestore

class ListPostPage extends React.Component {
  constructor(props){
    super (props);
    console.log("in post page");
    let document = this.props.route.params.document;
    console.log("doc: " + document);
  }

  getTags = (documentSnapshot) => {
    return documentSnapshot.get('followingTags');
  }

  onFollowPressed = () => {
    const currentUser = firebase.auth().currentUser;
    db.collection('Users')
    .doc(currentUser.uid)
    .get()
    .then(documentSnapshot => this.getTags(documentSnapshot))
    .then(tags => {
        if (tags.includes(this.props.route.params.document)) {
          Alert.alert(
            "You are already following this topic",
            "Do you want to unfollow?",
            [
                {text: 'Unfollow', onPress: () => {
                    const currentUser = firebase.auth().currentUser;

                    db.collection('Users')
                    .doc(currentUser.uid)
                    .update({
                      followingTags: firebase.firestore.FieldValue.arrayRemove(this.props.route.params.document),
                    })
                }},
                {text: 'Cancel', style: 'cancel'}
            ]
        )
        } else {
          db.collection('Users')
          .doc(currentUser.uid)
          .update({
            followingTags: firebase.firestore.FieldValue.arrayUnion(this.props.route.params.document),
          })
          Alert.alert("Following Successfully");
        }
    });
    // db.collection('Users')
    //     .doc(currentUser.uid)
    //     .update({
    //         followingUsers: firebase.firestore.FieldValue.arrayUnion(this.props.route.params.document),
    //     })
  }

  render(){
    return (
      <View>
      <Button color="#ffb300"
          title="List Topics Page"
          onPress={() => this.props.navigation.navigate('ListTopicPage')}
      />
      <Button color="#ffb300"
          title="Follow this topic"
          onPress={this.onFollowPressed}
      />
      <ScrollView>
        <InfiniteScroll title={'list post page'} navigation={this.props.navigation} collection={"Posts"} what={"Tag"} contain={[this.props.route.params.document]} card={"PostCard"} sortBy={"ID"}/>
      </ScrollView>
    </View>
    );
  }
}

export default ListPostPage;
