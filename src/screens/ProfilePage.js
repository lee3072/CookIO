import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';

var db = firebase.firestore(); //firestore

const ProfilePage = ({navigation}) => {
    const [uid,setUid] = useState('');
    const [email,setEmail] = useState('');
    const [username,setUsername] = useState('')
    const [followers,setFollowers] = useState('')
    const [followings,setFollowings] = useState('')
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

            function getFollowingUsers(documentSnapshot) {
                return documentSnapshot.get('followingUsers');
            }
                  
            db.collection('Users')
            .doc(currentUser.uid)
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

    return (
        <View style={styles.container}>
            <View style={styles.logoutButton}>
                <Button
                    color= "#ffdb85"
                    title="Direct Messaging"
                    onPress={() => {
                            firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then(doc => {
                                navigation.navigate('DirectMessageMainPage',{dm: doc.data().dmUsers})
                            })
                        }}
                />
                <Button
                    color= "#ffdb85"
                    title="Logout"
                    onPress={() => {
                            firebase.auth().signOut()
                            firebase.database().ref(firebase.auth().currentUser.uid)
                            .limitToLast(20)
                            .off()
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
                    <Text>Following</Text>
                    <Text>{followings}</Text>
                </View>
                <Button color= "#ffb300"
                    title="Change Profile"
                    onPress={() => navigation.navigate('EditProfilePage')}
                />
            </View>
            
            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="See Followings"
                    onPress={() => navigation.navigate('FollowingPage')}
                />
            </View>

            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="Make Post"
                    onPress={() => navigation.navigate('MakePostPage')}
                />
            </View>
            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="Feed Page"
                    onPress={() => navigation.navigate('ListTopicPage')}
                />
            </View>
            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="Other Profile Page 1"
                    onPress={() => navigation.navigate('UsersProfilePage', {uid: 'N78GForfcuTflORGKfdCZM69YhQ2'})}
                />
                <Button color= "#ffb300"
                    title="Other Profile Page 2"
                    onPress={() => navigation.navigate('UsersProfilePage', {uid: 'wswsec6LmQZ7khqT1rk60pMvwx33'})}
                />
            </View>
            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="My Posts"
                    onPress={() => navigation.navigate('UserFeedPage', {userid: uid })}
                />
            </View>
            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="Saved Posts"
                    onPress={() => navigation.navigate('SavedPostPage', {userid: uid })}
                />
            </View>
            <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="Following"
                    onPress={() => navigation.navigate('InterestPostPage', {userid: uid })}
                />
            </View>
            {/* <View style={styles.buttonMiddle}>
                <Button color= "#ffb300"
                    title="DM All User"
                    onPress={() => {
                        firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then(doc => {
                            navigation.navigate('DirectMessageMainAllUserPage',{dm: doc.data().dmUsers})
                        })
                    }}
                />
            </View> */}

        
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
    // DMButton: {
    //     paddingTop: 20,
    //     flexDirection: "row",
    //     justifyContent: "flex-start",
    // },
    logoutButton: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    refreshButton: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
    },

});

export default ProfilePage;