
import React, {useState} from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import * as Font from 'expo-font';
import 'firebase/firestore';
import styles from './auth_styles';
import firebase from '../../firebase_setup';

class PostView extends React.Component {
    constructor(props){
        super(props);
        this.state={
            test: 0,
            id: this.props.route.params.id,
            title: "default title",
            up: 0,
            down: 0,
            uid: firebase.auth().currentUser.uid.toString(),
            canVote: true,
            postRef: null,
            users: null,
            post: null,
        }
        this.getEverthing();
    }

    getEverthing = async () => {
        let db = firebase.firestore();
        let postRef = db.collection('testPosts').doc(this.state.id);
        const post = await postRef.get();
        this.setState({
            title: post.get('Title'),
            up: post.get('UpVote'),
            down: post.get('DownVote'),
            postRef: postRef,
            users: post.get('VotedUser'),
            test: 1, 
            post: post,
        })
        console.log('PostView');
        console.log(this.state.id);
        console.log(this.state.title);
        console.log(this.state.uid);
        console.log(this.state.users);
        console.log(this.state.users.includes(this.state.uid));
    }

    upVote = async () => {
        if(! (this.state.users.includes(this.state.uid))) {
            this.state.postRef.update({
                VotedUser: firebase.firestore.FieldValue.arrayUnion(this.state.uid),
                UpVote: this.state.up + 1,
            })
            this.setState({
                up: this.state.up+1,
                users: this.state.post.get('VotedUser'),
            })
            console.log('up voted');
        }
    }

    downVote = async () =>{
        if(! (this.state.users.includes(this.state.uid))) {
            this.state.postRef.update({
                VotedUser: firebase.firestore.FieldValue.arrayUnion(this.state.uid),
                DownVote: this.state.down + 1,
            })
            this.setState({
                down: this.state.down+1,
                users: this.state.post.get('VotedUser'),
            })
            console.log('down voted');
        }
    }

    render() {
        
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
            </SafeAreaView>
        );
    }
}

export default PostView;