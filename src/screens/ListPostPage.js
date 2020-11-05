import React from "react";
import 'firebase/firestore';
import { StyleSheet, View, ActivityIndicator, Text, RefreshControl, Button } from "react-native";
import { FlatList, ScrollView } from "react-native-gesture-handler";
import InfiniteScroll from "../components/InfiniteScroll"

class ListPostPage extends React.Component {
  constructor(props){
    super (props);
    console.log("in post page");
    let document = this.props.route.params.document;
    console.log("doc: " + document);
  }
  render(){
    return (
      <View>
      <Button color="#ffb300"
          title="List Topics Page"
          onPress={() => this.props.navigation.navigate('ListTopicPage')}
      />
      <ScrollView>
        <InfiniteScroll title={'list post page'} navigation={this.props.navigation} collection={"Posts"} what={"Tag"} contain={[this.props.route.params.document]} card={"PostCard"} sortBy={"ID"}/>
      </ScrollView>
    </View>
    );
  }
}

export default ListPostPage;
