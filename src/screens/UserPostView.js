import React from "react";
import 'firebase/firestore';
import UserInfiniteScroll from "../components/UserInfiniteScroll";

const UserPostView = ({ navigation }) => {
  return(<UserInfiniteScroll navigation={navigation} collection={"Posts"} card={"PostCard"} sortBy={"ID"}/>);
}



export default UserPostView;
