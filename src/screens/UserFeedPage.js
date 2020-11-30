import React from "react";
import 'firebase/firestore';
import UserInfiniteScroll from "../components/UserInfiniteScroll";
import { StyleSheet, View, Button, ScrollView } from 'react-native';

import firebase from '../../firebase_setup';


class UserFeedPage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userid: this.props.route.params.userid,
        }
        console.log("this.state.userid: "+this.state.userid)
    }
    render(){
        return(
            <View>
                <Button color="#ffb300"
                    title="Go to this user's profile"
                    onPress={() => this.props.navigation.navigate('UsersProfilePage', {uid: this.state.userid })}
                />
                <ScrollView>
                <UserInfiniteScroll navigation={this.props.navigation} collection={"Posts"} card={"PostCard"} sortBy={"ID"} where={this.state.userid}/>
                </ScrollView>
            </View>
        );
    }
}

export default UserFeedPage;