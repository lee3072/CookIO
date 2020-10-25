
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Button, Alert} from 'react-native';
import * as Font from 'expo-font';
import 'firebase/firestore';
import styles from '../styles/post_styles';
import firebase from '../../firebase_setup';

var db = firebase.firestore();
class PostView extends React.Component {
    constructor(props){
        super(props);
        this.state={
            id: this.props.route.params.id,
            title: "default title",
            up: 0,
            down: 0,
            uid: firebase.auth().currentUser.uid.toString(),
            postRef: null,
            users: null,
            voted: false,
            posteduser: '',
        }
        this.getEverthing();
    }

    getEverthing = async () => {
        //let db = firebase.firestore();
        let postRef = db.collection('Posts').doc(this.state.id);
        const post = await postRef.get();
        
        this.setState({
            title: post.get('Title'),
            up: post.get('UpVote'),
            down: post.get('DownVote'),
            postRef: postRef,
            users: post.get('VotedUser'),
            posteduser: post.get('PostedUser'),
            test: 1, 
        })
        console.log('PostView');
        console.log(this.state.id);
        console.log(this.state.title);
        console.log(this.state.uid);
        console.log(this.state.users);
        console.log(this.state.posteduser);
        console.log(this.state.users.includes(this.state.uid));
    }

    upVote = async () => {
        if(! (this.state.users.includes(this.state.uid) || this.state.voted)) {
            this.state.postRef.update({
                VotedUser: firebase.firestore.FieldValue.arrayUnion(this.state.uid),
                UpVote: this.state.up + 1,
            })
            console.log(this.state.users);
            this.setState({
                up: this.state.up+1,
                voted: true,
            })
            console.log(this.state.users);
            console.log('up voted');
        }
    }

    downVote = async () =>{
        if(! (this.state.users.includes(this.state.uid) || this.state.voted)) {
            this.state.postRef.update({
                VotedUser: firebase.firestore.FieldValue.arrayUnion(this.state.uid),
                DownVote: this.state.down + 1,
            })
            this.setState({
                down: this.state.down+1,
                voted: true,
            })
            console.log('down voted');
        }
    }

    onDeletePress = async () => {
        console.log("uid delete: " , this.state.uid)
        console.log("posteduser delete: ", this.state.posteduser);
        if (this.state.uid == this.state.posteduser) {
            db.collection("Posts").doc(this.state.id).delete();
            db.collection("Users").doc(this.state.uid).update({
                "postedPosts": firebase.firestore.FieldValue.arrayRemove(this.state.id)
            })
            this.props.navigation.navigate('FeedPage');
        } else {
            Alert.alert("You are not the owner of the Post");
        }
    }
    
    onEditPress = async () => {
        console.log("uid edit: " , this.state.uid)
        console.log("posteduser edit: ", this.state.posteduser);
        if (this.state.uid == this.state.posteduser) {
            this.props.navigation.navigate('EditPostPage', {id : this.state.id});
        }
        else {
            Alert.alert("You are not the owner of the Post");
        }
    }


    render() {
        /*let editbutton;
        let deletebutton;
        if (this.state.uid == this.state.posteduser) {

            console.log("HERE!!!!!!!!!!!!!!!!!!!!");
            console.log(this.state.id);
            editbutton = <Button color= "#ffb300"
                            title="Edit Post"
                            //id = {this.state.id}
                            onPress={() => this.props.navigation.navigate('EditPostPage', {id : this.state.id})}
                            //onPress={() => this.props.navigation.navigate('MakePostPage')}
                        />
            deletebutton = <Button 
                            color= "#ffb300"
                            title="Delete Post"
                            //onPress={() => this.props.navigation.navigate('EditPostPage', {id : this.state.id})}
            /> 
        }*/
        return (
            <SafeAreaView style={styles.container}>               
                <View style={styles.titleContainer}>
                    <Text style={{ fontWeight: "500" }}>{this.state.title}</Text>
                </View>
                <View style={{marginHorizontal: 30, marginTop: 12, height: 150, backgroundColor: "grey", }}>
                    <Text style={{ fontWeight: "500" }}>Image</Text>
                </View>
                <View style={styles.showContentContainer}>
                        <Text style={{ fontWeight: "500" }}>Content</Text>
                </View>
                <View style={styles.showTagContainer}>
                    <Text style={{ fontWeight: "500" }}>tags</Text>
                </View>
                <View style={styles.voteContainer}>
                    <TouchableOpacity >
                        <Text onPress={this.upVote} style={{ marginLeft:20, marginRight: 20, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Text onPress={this.downVote} style={{padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>Down</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.showTagContainer}>
                    <Text style={{ fontWeight: "500" }}>up vote: {this.state.up} down vote: {this.state.down}</Text>
                </View>
                <View style={styles.showCommentContainer}>
                    <Text style={{ fontWeight: "500" }}>Comments</Text>
                </View>
                <Button color= "#ffb300"
                title="Back to Feed Page" onPress={() => this.props.navigation.navigate('FeedPage')} />
                <Button color= "#ffb300"
                            title="Edit Post"
                            //id = {this.state.id}
                            onPress={this.onEditPress}

                            //onPress={() => this.props.navigation.navigate('EditPostPage', {id : this.state.id})}
                            //onPress={() => this.props.navigation.navigate('MakePostPage')}
                        />
                <Button 
                            color= "#ffb300"
                            title="Delete Post"
                            onPress={this.onDeletePress}
                            //onPress={() => this.props.navigation.navigate('EditPostPage', {id : this.state.id})}
            /> 

            </SafeAreaView>
        );
    }
}

export default PostView;