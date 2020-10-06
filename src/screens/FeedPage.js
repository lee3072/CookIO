import { database } from "firebase";
import React, { Component, useState } from "react";
import { StyleSheet, View, ScrollView, ActivityIndicator, Text } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import PostCard from "../components/PostCard";
import 'firebase/firestore';
import firebase from '../../firebase_setup';

export default class FeedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postData: [],
      limit: 1,
      lastVisible: null,
      loading: false,
      refreshing: false,
    };
  }

  componentDidMount = async () => {
    try {
      // Cloud Firestore: Initial Query (Infinite Scroll)
      this.retrieveData()
    }
    catch (error) {
      console.log(error);
    }
  }

  //retrieve initial data
  retrieveData = async () => {
    try{
      console.log('retrieving initial data')
      // set state loading
      this.setState({ loading: true });
      
      // get initial query data
      let initialQuery = await firebase.firestore()
        .collection("testPosts")
        .orderBy('id')
        .limit(3);

      let postSnapshots = await initialQuery.get();

      let postData = postSnapshots.docs.map(post => post.data());
      console.log('post Data');
      console.log(postData)

      let lastVisible = postData[postData.length - 1].id;
      console.log('Last Visible ID');
      console.log(postData.length);
      console.log(lastVisible);

      // set states
      this.setState({
        postData: postData,
        lastVisible: lastVisible,
        loading: false,
      });
    } catch (error) {
      console.log(error);
    }
  }

  //retrieve more data form firebse
  retrieveMore = async () => {
    try{
      console.log('Retrieving additional post Data');
      this.setState({ refreshing: true });

      console.log('Last Visible ID');
      console.log(this.state.lastVisible);

      let additionalQuery = await firebase.firestore().collection("Posts")
        .orderBy('id')
        .startAfter(this.state.lastVisible)
        .limit(1);
  
      let postSnapshots = await additionalQuery.get();
      let postData = postSnapshots.docs.map(post => post.data());
      console.log('post Data');
      console.log(postData);

      let lastVisible = postData[postData.length - 1].id;
  

      this.setState({
        postData: [...this.state.postData, ...postData],
        lastVisible: lastVisible,
        refreshing: true,
      });

    } catch(error){
      console.log(error);
    }
  }

  renderHeader = () => {
    return (
      <View style={styles.header}>
        <Text style={styles.title}>Items</Text>
      </View>
    );
  }

  renderFooter = () => {
    // Check If Loading
    if (this.state.loading || this.state.refreshing) {
    // if (this.state.loading) {
      return (
        <View style={styles.activityIndicator}>
          <ActivityIndicator />
        </View>
      );
    }
    else {
      return null;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <CupertinoSearchBarBasic
          style={styles.cupertinoSearchBarBasic}
        ></CupertinoSearchBarBasic>
  
        <FlatList
          data={this.state.postData}
          // Element Key
          keyExtractor={(item, index) => String(index)}
          // renderItem={({ item }) => (
          //   <PostCard style={styles.postCard}> item={item} </PostCard>
          // )}
          renderItem={({ item }) => {
            return (  
              <View style={styles.item}>
                <Text>Item {item.id}</Text>
              </View>
            )
          }}
          // Header (Title)
          // ListHeaderComponent={this.renderHeader}
          // Footer (Activity Indicator)
          ListFooterComponent={this.renderFooter}
          // On End Reached (Takes in a function)
          onEndReached={this.retrieveMore}
          // How Close To The End Of List Until Next Data Request Is Made
          onEndReachedThreshold={20}
          // Refreshing (Set To True When End Reached)
          refreshing={this.state.refreshing}
        />
  
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  cupertinoSearchBarBasic: {
    height: 40,
    marginTop: 24
  },
  scrollArea: {
    width: 360,
    height: 527,
    backgroundColor: "#E6E6E6"
  },
  scrollArea_contentContainerStyle: {
    height: 527,
    width: 360
  },
  postCard: {
    width: 300,
    height: 208,
    marginTop: 39,
    alignSelf: "center"
  },
  footer: {
    padding: 15,
  },
  footerText: {
    fontWeight: '600',
  },
  item: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    width: '100%',
  },
  header: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  }
});

// export default FeedPage;
