// import React from 'react';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
//import styles from '../styles/auth_styles';

var db = firebase.firestore(); //firestore

const ProfilePage = ({navigation}) => {
    const [uid,setUid] = useState('');
    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('')
    const [followers,setFollowers] = useState('')
    const [interest,setInterest] = useState('')
    const [icon,setIcon] = useState('')

    const updateData = () => {
        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
            console.log('Success');
            setUid(currentUser.uid)
            setEmail(currentUser.email)
            function getUserName(documentSnapshot) {
                return documentSnapshot.get('userName');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getUserName(documentSnapshot))
            .then(userName => {
                setUsername(userName)
            });

            function getNFollowers(documentSnapshot) {
                return documentSnapshot.get('numberOfFollowers');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getNFollowers(documentSnapshot))
            .then(nFollowers => {
                setFollowers(nFollowers)
            });

            function getInterest(documentSnapshot) {
                return documentSnapshot.get('topicsOfInterest');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getInterest(documentSnapshot))
            .then(topicOfInterest => {
                setInterest(topicOfInterest)
            });

            function getIcon(documentSnapshot) {
                return documentSnapshot.get('userIcon');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getIcon(documentSnapshot))
            .then(userIcon => {
                setIcon(userIcon)
            });
        }
    };

    useEffect(() => {
        const cleanup = navigation.addListener('focus', () => {
            updateData()
        });
        return cleanup;
    }, [navigation]);

    return (
        <View style={styles.container}>
            <View style={styles.logoutButton}>
                <Button
                    color= "#ffdb85"
                    title="Logout"
                    onPress={() => {
                            firebase.auth().signOut()
                            navigation.navigate('SignInPage')
                        }}
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
                    <Text>Followings</Text>
                    <Text>N/A</Text>
                </View>
                <Button color= "#ffb300"
                    title="Change Profile"
                    onPress={() => navigation.navigate('EditProfilePage')}
                />
            </View>
            
            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="Make Post"
                    onPress={() => navigation.navigate('MakePostPage')}
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

});

export default ProfilePage;