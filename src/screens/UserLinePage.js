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
                <View style={{
                    borderTopWidth: (Platform.OS === 'ios') ? 2 : 0,
                    borderBottomWidth: (Platform.OS === 'ios') ? 2 : 0,
                    marginVertical: (Platform.OS === 'ios') ? 2 : 0,
                    borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
                }}>
                    <Button color= "#ffb300"
                        title="Profile"
                        onPress={() => {
                            this.props.navigation.navigate('ProfilePage')
                        }}
                    />
                </View>
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
        );
    }
}

export default UserLinePage;
