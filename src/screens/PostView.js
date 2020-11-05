
import React, { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, Text, View, Image, TouchableOpacity, Button, Alert } from 'react-native';
import * as Font from 'expo-font';
import 'firebase/firestore';
import styles from '../styles/post_styles';
import firebase from '../../firebase_setup';
import InfiniteScroll from "../components/InfiniteScroll"
import { setStatusBarNetworkActivityIndicatorVisible } from 'expo-status-bar';

var db = firebase.firestore();
class PostView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            test: 0,
            id: this.props.route.params.id,
            title: "default title",
            up: 0,
            down: 0,
            uid: firebase.auth().currentUser.uid.toString(),

            content: null,
            image: null,
            date: null,
            postedUser: null,
            tag: null,

            canVote: true,
            postRef: null,
            users: null,
            voted: false,

            comment: null,

            posteduser: '',
        }
        this.getEverthing();
    }
    componentDidMount() {
        this.getEverthing();
    }
    componentDidUpdate() {
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

            content: post.get('Content'),
            image: post.get('Image'),
            date: post.get('PostedDate'),
            postedUser: post.get('PostedUser'),
            tag: post.get('Tag'),

            users: post.get('VotedUser'),
            posteduser: post.get('PostedUser'),
            test: 1,
        })
    }


    upVote = async () => {
        if (!(this.state.users.includes(this.state.uid) || this.state.voted)) {
            this.state.postRef.update({
                VotedUser: firebase.firestore.FieldValue.arrayUnion(this.state.uid),
                UpVote: this.state.up + 1,
            })
            console.log(this.state.users);
            this.setState({
                up: this.state.up + 1,
                voted: true,
            })
            console.log(this.state.users);
            console.log('up voted');
        }
    }

    downVote = async () => {
        if (!(this.state.users.includes(this.state.uid) || this.state.voted)) {
            this.state.postRef.update({
                VotedUser: firebase.firestore.FieldValue.arrayUnion(this.state.uid),
                DownVote: this.state.down + 1,
            })
            this.setState({
                down: this.state.down + 1,
                voted: true,
            })
            console.log('down voted');
        }
    }

    savePost = async () => { 
        let db = firebase.firestore();
        let userRef = db.collection('Users').doc(this.state.uid);
        userRef.update({
            savedPost: firebase.firestore.FieldValue.arrayUnion(this.state.id)
        })
        console.log('post saved')
        this.props.navigation.navigate('ListTopicPage');
    }

    comment = async () => {
        console.log("commenting");
        let db = firebase.firestore();
        let comRef = db.collection('Comments');
        let postRef = db.collection('Posts').doc(this.state.id);
        let userRef = db.collection('Users').doc(this.state.uid);
        
        var comment = await comRef.add({
            ID: "default",
            Under: postRef.id.toString(),
            Date: firebase.firestore.FieldValue.serverTimestamp(),
            By: this.state.uid,
            Content: this.state.comment,
        });
        comment.update({
            ID: comment.id.toString(),
        })

        postRef.update({
            CommentsIDs: firebase.firestore.FieldValue.arrayUnion(comment.id.toString())
        })

        userRef.update({
            postedComments: firebase.firestore.FieldValue.arrayUnion(comment.id.toString())
        })
    }

    onDeletePress = async () => {
        console.log("uid delete: " , this.state.uid)
        console.log("posteduser delete: ", this.state.posteduser);
        if (this.state.uid == this.state.posteduser) {
            db.collection("Posts").doc(this.state.id).delete();
            db.collection("Users").doc(this.state.uid).update({
                "postedPosts": firebase.firestore.FieldValue.arrayRemove(this.state.id)
            })
            this.props.navigation.navigate('ListTopicPage');
        } else {
            Alert.alert("You are not the owner of the Post");
        }
    }
    
    onEditPress = async () => {
        if (this.state.uid == this.state.posteduser) {
            this.props.navigation.navigate('EditPostPage', {post: this.state});
        }
        else {
            Alert.alert("You are not the owner of the Post");
        }
    }



    render() {

        return (
            <SafeAreaView style={styles.container}>
                <Button color="#ffb300" title="Back" onPress={() => this.props.navigation.goBack()}/>
                <ScrollView style={styles.scrollView}>
                    <View style={styles.titleContainer}>
                        <Text style={{ fontWeight: "500" }}>{this.state.title}</Text>
                    </View>
                    <View style={styles.showTagContainer}>
                        <Text style={{ fontWeight: "500" }}>{this.state.tag}</Text>
                    </View>
                    <View style={styles.voteContainer}>
                        <TouchableOpacity >
                            <Text onPress={this.upVote} style={{ width: 75, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>Up</Text>
                        </TouchableOpacity>
                        <TouchableOpacity >
                            <Text onPress={this.downVote} style={{ width: 75, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>Down</Text>
                        </TouchableOpacity>
                        <Text style={{ fontWeight: "500" }}>up vote: {this.state.up}</Text>
                        <Text style={{ fontWeight: "500" }}>down vote: {this.state.down}</Text>
                    </View>
                    <View style={{ marginHorizontal: 32, marginTop: 32, height: 400, resizeMode: "contain" }}>
                        <Image source={{ uri: this.state.image }} style={{ width: "100%", height: "100%" }}></Image>
                    </View>
                    <View style={styles.showContentContainer}>
                        <Text style={{ fontWeight: "500" }}>{this.state.content}</Text>
                    </View>
                    <TouchableOpacity >
                            <Text onPress={this.savePost} style={{ width: 100, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>save this post</Text>
                        </TouchableOpacity>
                    <View style={{flexDirection: "column", flex: 1}}>
                        <View style={styles.inputContainer}>
                            <TextInput multiline={true} numberOfLines={10} style={{ flex: 1 }} placeholder="Want to say something?" textAlignVertical='top' onChangeText={text => this.setState({comment: text})} value={this.state.comment}></TextInput>
                        </View>
                        <TouchableOpacity>
                            <Text onPress={this.comment} style={{ width: 75, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>comment</Text>
                        </TouchableOpacity>
                    </View>
                    <Button color= "#ffb300" title="Edit Post" onPress={this.onEditPress}/>
                    <Button color= "#ffb300" title="Delete Post" onPress={this.onDeletePress}/> 
                    <View style={styles.showCommentContainer}>
                        <InfiniteScroll title={'comment section:'} navigation={this.props.navigation} collection={"Comments"} what={"Under"} contain={[this.state.id]} card={"CommentCard"} sortBy={"Date"}/>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default PostView;