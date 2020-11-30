import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';

var db = firebase.firestore(); //firestore

const UsersProfilePage = ({route, navigation}) => {
    const { uid } = route.params;
    const [followingStat,setFollowingStat] = useState('')
    const [username,setUsername] = useState('')
    const [followers,setFollowers] = useState('')
    const [followings,setFollowings] = useState('')
    const [interest,setInterest] = useState('')
    const [icon,setIcon] = useState('')

    const updateData = () => {

        const currentUser = firebase.auth().currentUser;

        if (!currentUser) {
            navigation.navigate('GuestErrorPage')
        } else {

        function getBlocked(documentSnapshot) {
            return documentSnapshot.get('blockedUsers');
        }

        db.collection('Users')
        .doc(currentUser.uid)
        .get()
        .then(documentSnapshot => getBlocked(documentSnapshot))
        .then(blocked => {
            if (blocked.includes(uid)) {
                navigation.navigate('EmptyProfilePage')
            }
        });

        db.collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getBlocked(documentSnapshot))
        .then(blocked => {
            if (blocked.includes(currentUser.uid)) {
                navigation.navigate('EmptyProfilePage')
            }
        });

        db.collection("Users").doc(uid).get().then(doc => {
            if (!doc.exists){
                navigation.navigate('EmptyProfilePage')
            }
        })

        function getUserName(documentSnapshot) {
            return documentSnapshot.get('userName');
        }
        db.collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getUserName(documentSnapshot))
        .then(userName => {
            setUsername(userName)
        });

        function getFollowers(documentSnapshot) {
            return documentSnapshot.get('followers');
        }
        
        db.collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getFollowers(documentSnapshot))
        .then(followers => {
            setFollowers(followers.length)
            if (followers.includes(currentUser.uid)) {
                setFollowingStat('Unfollow')
            } else {
                setFollowingStat('Follow')
            }
        });

        function getInterest(documentSnapshot) {
            return documentSnapshot.get('topicsOfInterest');
        }
            
        db.collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getInterest(documentSnapshot))
        .then(topicOfInterest => {
            setInterest(topicOfInterest)
        });

        function getIcon(documentSnapshot) {
            return documentSnapshot.get('userIcon');
        }
            
        db.collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getIcon(documentSnapshot))
        .then(userIcon => {
            setIcon(userIcon)
        });

        function getFollowingUsers(documentSnapshot) {
            return documentSnapshot.get('followingUsers');
        }
                
        db.collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getFollowingUsers(documentSnapshot))
        .then(followingUsers => {
            setFollowings(followingUsers.length);
        });

    }
    };

    useEffect(() => {
        const cleanup = navigation.addListener('focus', () => {
            updateData()
        });
        return cleanup;
    }, [navigation]);

    const onFollowPressed = () => {
        const currentUser = firebase.auth().currentUser;
        if(followingStat == 'Follow') {
            setFollowingStat('Unfollow')
            db.collection('Users')
                .doc(uid)
                .update({
                    followers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
                    numberOfFollowers: firebase.firestore.FieldValue.increment(1),
                })
            setFollowers(followers + 1)
            db.collection('Users')
                .doc(currentUser.uid)
                .update({
                    followingUsers: firebase.firestore.FieldValue.arrayUnion(uid),
                })
        } else {
            setFollowingStat('Follow')
            db.collection('Users')
                .doc(uid)
                .update({
                    followers: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
                    numberOfFollowers: firebase.firestore.FieldValue.increment(-1),
                })
                setFollowers(followers - 1)
            db.collection('Users')
                .doc(currentUser.uid)
                .update({
                    followingUsers: firebase.firestore.FieldValue.arrayRemove(uid),
                })
        }
    }

    const onBlockPressed = () => {
        const currentUser = firebase.auth().currentUser;
        if(followingStat == 'Unfollow') {
            setFollowingStat('Follow')
            db.collection('Users')
                .doc(uid)
                .update({
                    followers: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
                    numberOfFollowers: firebase.firestore.FieldValue.increment(-1),
                })
                setFollowers(followers - 1)
            db.collection('Users')
                .doc(currentUser.uid)
                .update({
                    followingUsers: firebase.firestore.FieldValue.arrayRemove(uid),
                })
        }
        db.collection('Users')
        .doc(currentUser.uid)
        .update({
            blockedUsers: firebase.firestore.FieldValue.arrayUnion(uid),
        })
        navigation.navigate('ProfilePage')
    }

    return (
        <View style={styles.container}>
            <View style={styles.logoutButton}>
                <Button
                    color= "#ffdb85"
                    title="Block"
                    onPress={onBlockPressed}
                />
            </View>
            <View style={{ margineTop: 60}}>
                <View style = {styles.profileContainer}>
                    
                    <Image
                        style={styles.icon}
                        source={
                            icon
                                ? { uri: icon }
                                : require("../assets/temp_icon.jpg")}/>
                    <Text style={styles.username}>{username}</Text>
                </View>
                <View style={styles.interestBox}>
                    <Text style={styles.interestedIn}>Interested in..</Text>
                    <Text style={styles.interest}>{interest}</Text>
                </View>
            </View>

            <View style={styles.rowContainer}>
                <View style={styles.followerFollowing}>
                    <Text>Follower</Text>
                    <Text>{followers}</Text>
                </View>
                <View style={styles.followerFollowing}>
                    <Text>Following</Text>
                    <Text>{followings}</Text>
                </View>
                <Button color= "#ffb300"
                    title={followingStat}
                    onPress={onFollowPressed}
                />
            </View>

            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="Topic Page"
                    onPress={() => navigation.navigate('ListTopicPage')}
                />
                <Button color= "#ffb300"
                    title="Profile Page"
                    onPress={() => navigation.navigate('ProfilePage')}
                />
            </View>

        
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: "center",
        padding: 13,
    },
    profileContainer: {
        alignItems: "center",
        marginTop: 10,
    }, 
    icon: {
        width: 146,
        height: 146,
        borderRadius: 68,
    },
    username: {
        fontSize: 30,
        //color: "#363636",
        fontWeight: "bold",
        paddingVertical: 10,
    },
    interestBox: {
        alignItems: "center",
    },
    interest: {
        fontSize: 15,
        color: "#636363",
        //marginLeft: 15,
    },
    interestedIn: {
        fontSize: 18,
        color: "#636363",
    },
    rowContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    buttonMiddle: {
        paddingHorizontal: 10,
    },
    followerFollowing: {
        padding: 20,
        alignItems: "center",
    },
    logoutButton: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    refreshButton: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
    },

});

export default UsersProfilePage;