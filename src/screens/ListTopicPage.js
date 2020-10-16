import React from "react";
import 'firebase/firestore';

import InfiniteScroll from "../components/InfiniteScroll"

const ListTopicPage = ({ navigation }) => {
  return(<InfiniteScroll title={'list topic page'} navigation={navigation} collection={"Tags"} card={"TagCard"} sortBy={"ID"}/>);
}

export default ListTopicPage;
