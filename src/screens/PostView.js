
import React, { useState } from 'react';
import { SafeAreaView, ActivityIndicator, StyleSheet, FlatList, RefreshControl, TextInput, Text, View, Image, TouchableOpacity, Button, Alert } from 'react-native';
import * as Font from 'expo-font';
import 'firebase/firestore';
import styles from '../styles/post_styles';
import firebase from '../../firebase_setup';
import { ThemeProvider } from "@react-navigation/native";
import CommentCard from "../components/CommentCard";

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
            uid: firebase.auth().currentUser ? firebase.auth().currentUser.uid.toString() : "guest",

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

            data: [],
            lastVisible: null,
            loading: false,
            refreshing: false,
            fresh: true,
            haveMore: true,
            list: [],
            count: 3,
            limit: 3,
        }

        this.getEverthing();
    }

    componentDidMount() {
        this.getEverthing();
        try {
            // Cloud Firestore: Initial Query (Infinite Scroll)
            this.retrieveData()
        }
        catch (error) {
            console.log(error);
        }
        this.onEndReachedCalled = false;
    }
    componentDidUpdate() {
        this.getEverthing();
    }

    //header section
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
            // console.log(this.state.users);
            this.setState({
                up: this.state.up + 1,
                voted: true,
            })
            // console.log(this.state.users);
            this.vote(true)
            // console.log('up voted');
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
            this.vote(false)
            // console.log('down voted');
        }
    }
    vote = async (ifUP) => {
        let db = firebase.firestore();
        let userRef = db.collection('Users').doc(this.state.uid);
        let currentTime = firebase.firestore.Timestamp.now()
        if (ifUP) {
            userRef.update({
                upVotes: firebase.firestore.FieldValue.arrayUnion({ postID: this.state.id, date: currentTime.seconds.toString() + currentTime.nanoseconds.toString() })
            })
        } else {
            userRef.update({
                downVotes: firebase.firestore.FieldValue.arrayUnion({ postID: this.state.id, date: currentTime.seconds.toString() + currentTime.nanoseconds.toString() })
            })
        }

    }
    savePost = async () => {
        let db = firebase.firestore();
        let userRef = db.collection('Users').doc(this.state.uid);
        let currentTime = firebase.firestore.Timestamp.now();
        let contains = (await userRef.get()).data()["savedPost"].includes(this.state.id);
        if (!contains) { //check if post is aready saved
            userRef.update({    //if not save the post
                savedPost: firebase.firestore.FieldValue.arrayUnion(this.state.id),
                savedPostWithTime: firebase.firestore.FieldValue.arrayUnion({ postID: this.state.id, date: currentTime.seconds.toString() + currentTime.nanoseconds.toString() })
            })
            console.log('post saved')
        } else {
            console.log("post aready saved")
        }

    }
    comment = async () => {
        // console.log("commenting");
        let db = await firebase.firestore();
        let comRef = await db.collection('Comments');
        let postRef = await db.collection('Posts').doc(this.state.id);
        let userRef = await db.collection('Users').doc(this.state.uid);
        let temp = await (await (userRef.get())).data()
 
        // console.log("timestemp: ")
        // console.log(firebase.firestore.Timestamp.now().seconds)
        let currentTime = firebase.firestore.Timestamp.now()
        let timeStemp = currentTime.seconds.toString() + currentTime.nanoseconds.toString()
        var comment = await comRef.add({
            ID: "default",
            Under: postRef.id.toString(),
            Date: timeStemp,
            DisplayDate: Date(),
            By: this.state.uid,
            ByUserID: temp.userName,
            Content: this.state.comment,
        });
        comment.update({
            ID: comment.id.toString(),
        })

        postRef.update({
            CommentsIDs: firebase.firestore.FieldValue.arrayUnion(comment.id.toString())
        })

        userRef.update({
            postedComments: firebase.firestore.FieldValue.arrayUnion({ commentID: comment.id.toString(), date: timeStemp })
        })
        this.setState({comment: ""})
        this.retrieveMore();
        this.forceUpdate();
    }
    onDeletePress = async () => {
        console.log("uid delete: ", this.state.uid)
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
            this.props.navigation.navigate('EditPostPage', { post: this.state });
        }
        else {
            Alert.alert("You are not the owner of the Post");
        }
    }

    //scroll section
    //retrieve initial data
    retrieveData = async () => {
        try {
            // console.log("retrieveing initial data")
            this.setState({ loading: true });

            //if retrieving from a collection
            let initialQuery = await firebase.firestore()
                .collection("Comments")
                .where("Under", 'in', [this.state.id])
                .orderBy("Date")
                .limit(this.state.limit);

            let postSnapshots = await initialQuery.get();
            let data = postSnapshots.docs.map(post => post.data());
            let lastVisible = data[data.length - 1].Date;

            // set states
            this.setState({
                data: data,
                lastVisible: lastVisible,
                loading: false,
            });
            // console.log(this.state.data)
            // console.log(this.state.lastVisible)
        } catch (error) {
            console.log(error);
        }
    }
    //retrieve more data form firebse
    retrieveMore = async () => {
        try {
            // console.log("-------------------------------------------------------")
            // console.log("retrieveing more data")
            this.setState({ refreshing: true });

            let additionalQuery = await firebase.firestore()
                .collection("Comments")
                .where("Under", 'in', [this.state.id])
                .orderBy("Date")
                .startAfter(this.state.lastVisible)
                .limit(this.state.limit);

            let postSnapshots = await additionalQuery.get();
            let data = postSnapshots.docs.map(post => post.data());
            // console.log(data)

            if (data.length == 0) {
                this.setState({
                    haveMore: false,
                    refreshing: false,
                });
            } else {
                let lastVisible = data[data.length - 1].Date;
                // console.log(lastVisible)
                this.setState({
                    data: [...this.state.data, ...data],
                    lastVisible: lastVisible,
                    refreshing: false,
                });
            }

        } catch (error) {
            console.log(error);
        }
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
        } catch (error) {
            console.log(error);
        }
    }

    //tail
    ListFooterComponent = () => {
        return (
            <View style={styles.bottomfoot}>
                {
                    this.state.data.length != 0 ?
                        !this.state.haveMore ? (
                            <Text style={styles.footText}>-congrat, you reached the end-</Text>
                        ) : (
                                <View style={styles.activeLoad}>
                                    <ActivityIndicator size="small" animating={this.state.animating} />
                                    <Text style={[styles.footText, styles.ml]}>Loading more...</Text>
                                </View>
                            )
                        :
                        null
                }

            </View>
        );
    };

    renderCard = (item) => {
        return (<CommentCard style={styles.postCard} item={item} navigation={this.props.navigation} />);
    }

    _onEndReached = () => {
        if (this.state.haveMore && !this.onEndReachedCalled) {
            this.retrieveMore()
        }
        ThemeProvider.onEndReachedCalled = true;
    }

    render() {
        return (
            <FlatList
                // the view post section
                ListHeaderComponent={
                    <>
                        <View style={{
                            borderTopWidth: (Platform.OS === 'ios') ? 2 : 0,
                            borderBottomWidth: (Platform.OS === 'ios') ? 2 : 0,
                            marginVertical: (Platform.OS === 'ios') ? 2 : 0,
                            borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
                        }}>
                            <Button color="#ffb300" title="Back" onPress={() => this.props.navigation.goBack()} />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text style={{ fontWeight: "500" }}>{this.state.title}</Text>
                        </View>
                        <View style={styles.showTagContainer}>
                            <Text style={{ fontWeight: "500" }}>{this.state.tag}</Text>
                        </View>
                        <View style={styles.voteContainer}>
                            <TouchableOpacity onPress={this.upVote} style={{ width: 75, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>
                                <Text>Up</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.downVote} style={{ width: 75, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>
                                <Text>Down</Text>
                            </TouchableOpacity>
                            <Text style={{ fontWeight: "500" }}>up vote: {this.state.up}</Text>
                            <Text style={{ fontWeight: "500" }}>down vote: {this.state.down}</Text>
                        </View>
                        <View style={{ marginHorizontal: 32, marginTop: 32, height: 400, resizeMode: "contain" }}>
                            <Image source={this.state.image ? { uri: this.state.image } : require("../assets/temp_icon.jpg")} style={{ width: "100%", height: "100%" }}></Image>
                        </View>
                        <View style={styles.showContentContainer}>
                            <Text style={{ fontWeight: "500" }}>{this.state.content}</Text>
                        </View>
                        <TouchableOpacity onPress={this.savePost} style={{ width: 100, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>
                            <Text>save this post</Text>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "column", flex: 1 }}>
                            <View style={styles.inputContainer}>
                                <TextInput multiline={true} numberOfLines={10} style={{ flex: 1 }} placeholder="Want to say something?" textAlignVertical='top' onChangeText={text => this.setState({ comment: text })} value={this.state.comment}></TextInput>
                            </View>
                            <TouchableOpacity onPress={this.comment} style={{ width: 75, padding: 5, borderRadius: 1, borderWidth: 1, borderColor: "#000000" }}>
                                <Text>comment</Text>
                            </TouchableOpacity>
                        </View>
                        <Button color="#ffb300" title="Edit Post" onPress={this.onEditPress} />
                        <Button color="#ffb300" title="Delete Post" onPress={this.onDeletePress} />
                    </>
                }

                // the comment section
                data={this.state.data}
                // Element Key
                keyExtractor={(item, index) => String(index)}
                onEndReached={this._onEndReached}
                refreshing={true}
                renderItem={({ item }) => this.renderCard(item)}
                ListFooterComponent={this.ListFooterComponent}
                onEndReachedThreshold={0.001}

                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this.retrieveMore}
                    />
                }
            />

        );
    }
}

export default PostView;