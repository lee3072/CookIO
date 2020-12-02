import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';

var db = firebase.firestore(); //firestore

const GuestProfilePage = ({route, navigation}) => {
    const { uid } = route.params;
    const [username,setUsername] = useState('')
    const [followers,setFollowers] = useState('')
    const [followings,setFollowings] = useState('')
    const [interest,setInterest] = useState('')
    const [icon,setIcon] = useState('')

    const updateData = () => {

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
    };

    useEffect(() => {
        const cleanup = navigation.addListener('focus', () => {
            updateData()
        });
        return cleanup;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={[styles.logoutButton,styles.iosButtonSetting]}>
                <Button
                    color= "#ffdb85"
                    title="Back to main guest page"
                    onPress={() => navigation.navigate('GuestViewPage')}
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
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
    },
    refreshButton: {
        marginTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignSelf: "flex-start"
    },
    iosButtonSetting: {
        borderWidth: (Platform.OS === 'ios') ? 2 : 0,
        marginVertical: (Platform.OS === 'ios') ? 2 : 0,
        borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
    }
});

export default GuestProfilePage;