import React from "react";
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import 'firebase/firestore';
import firebase from '../../firebase_setup';
 
import InfiniteScroll from "../components/InfiniteScroll"


class UserLinePage extends React.Component {
    constructor(props){
        super(props);
        this.state={
            userid: this.props.route.params.userid,
        }
        console.log("user line:")
        console.log(this.state.userid)
    }

    render(){
        return (
            <View>
                <Text>{"\n\n\n\n\n"}</Text>
                <Button color="#ffb300"
                    title="Created Posts"
                    onPress={() => this.props.navigation.navigate('ShowUserPostsPage', {userid: this.state.userid})}
                />
                <Text>{"\n\n\n\n"}</Text>
                <Button color="#ffb300"
                    title="Interactions"
                    onPress={() => this.props.navigation.navigate('ShowUserActivityPage', {userid: this.state.userid})}
                />
            </View>
            // <InfiniteScroll title={'list topic page'} navigation={navigation} collection={"Tags"} card={"TagCard"} sortBy={"ID"}/>
        );
    }
}

export default UserLinePage;
