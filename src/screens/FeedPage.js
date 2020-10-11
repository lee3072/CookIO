import { database } from "firebase";
import React, { Component, useState } from "react";
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import CupertinoSearchBarBasic from "../components/CupertinoSearchBarBasic";
import PostCard from "../components/PostCard";
import 'firebase/firestore';
import firebase from '../../firebase_setup';

class FeedPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      postData: [],
      limit: 1,
      lastVisible: null,
      loading: false,
      refreshing: false,
      haveMore: true,
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
        .collection("Posts")
        .orderBy('ID')
        .limit(3);

      let postSnapshots = await initialQuery.get();

      let postData = postSnapshots.docs.map(post => post.data());
      console.log('post Data');
      console.log(postData)

      let lastVisible = postData[postData.length - 1].id;

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
    if (this.state.haveMore == true) {
      try{
        console.log('Retrieving additional post Data');
        this.setState({ refreshing: true });

        let additionalQuery = await firebase.firestore().collection("Posts")
          .orderBy('ID')
          .startAfter(this.state.lastVisible)
          .limit(1);
    
        let postSnapshots = await additionalQuery.get();
        let postData = postSnapshots.docs.map(post => post.data());
        console.log('post Data');
        console.log(postData);
        
        if(postData.length==0){
          this.setState({
            haveMore: false ,
            refreshing: false,
          });
        } else  {
          let lastVisible = postData[postData.length - 1].id;
          console.log('Last Visible ID            1');
          console.log(lastVisible);
          
          this.setState({
            postData: [...this.state.postData, ...postData],
            lastVisible: lastVisible,
            refreshing: false,
          });
        }

      } catch(error){
        console.log(error);
      }
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
    try {
      if (this.state.loading || this.state.refreshing) {
        return (
          <View style={styles.activityIndicator}>
            <ActivityIndicator />
          </View>
        );
      }
      else {
        return null;
      }
    } catch(error) {
      console.log(error);
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Button color= "#ffb300"
            title="My Profile"
            onPress={() => this.props.navigation.navigate('ProfilePage')}
        />

        <CupertinoSearchBarBasic
          style={styles.cupertinoSearchBarBasic}
        ></CupertinoSearchBarBasic>
  
        <FlatList
          data={this.state.postData}
          // Element Key
          keyExtractor={(item, index) => String(index)}
          renderItem={({ item }) => (
            <PostCard style={styles.postCard} item={item} navigation={this.props.navigation}/>
          )}
          // Header (Title)
          ListHeaderComponent={this.renderHeader}

          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.retrieveMore}
            />
          }
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

export default FeedPage;
