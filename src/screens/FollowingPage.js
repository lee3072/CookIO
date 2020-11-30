import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, Text, View, SafeAreaView, TextComponent, Alert } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

var db = firebase.firestore(); //firestore

const FollowingPage = ({navigation}) => {
    
    const [uid,setUid] = useState('');
    const [followingUsers,setfollowingUsers] = useState([])
    const [usernameList,setUsernameList] = useState([])


    const uidToName = async (uid) => {
        function getUserName(documentSnapshot) {
            return documentSnapshot.get('userName');
        }

        db.collection('Users')
        .doc(uid)
        .get()
        .then(documentSnapshot => getUserName(documentSnapshot))
        .then(userName => {
            setUsernameList(prevArray => [...prevArray, userName])
        });
    }

    const uidToNameList = (uidList) => {
        var i;
        for(i = 0; i < uidList.length; i++) {
            uidToName(uidList[i])
        }
    }
    const updateData = () => {
        setUsernameList([])
        setfollowingUsers([])
        const currentUser = firebase.auth().currentUser;
        console.log('Following Page: updateData')
        if (currentUser) {

            setUid(currentUser.uid)

            function getFollowingUsers(documentSnapshot) {
                return documentSnapshot.get('followingUsers');
            }
                  
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getFollowingUsers(documentSnapshot))
            .then(following => {
                setfollowingUsers(following);
                uidToNameList(following)
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
            <View style={{
                marginTop: (Platform.OS === 'ios') ? 40 : 20,
                borderWidth: (Platform.OS === 'ios') ? 2 : 0,
                marginVertical: (Platform.OS === 'ios') ? 2 : 0,
                borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
            }}>
                <Button color="#ffb300"
                    title="My Profile"
                    onPress={() => navigation.navigate('ProfilePage')}
                />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Following Users</Text>
                <View style={[styles.buttonStyle,styles.iosButtonSetting]}>
                    <Button color= "#ffb300"
                        title="Following Tags"
                        onPress={() => navigation.navigate('FollowingTagPage')}
                    />
                </View>
            </View>
            <ScrollView>
            {
            usernameList.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={() =>
                    Alert.alert(
                        l,
                        "",
                        [
                            {text: 'Go to Profile', onPress: () => {
                                var index = usernameList.indexOf(l)
                                var uidFound = followingUsers[index]
                                navigation.navigate('UsersProfilePage', {uid: uidFound})
                            }},
                            {text: 'Unfollow', onPress: () => {
                                const currentUser = firebase.auth().currentUser;
                                var index = usernameList.indexOf(l)
                                var uidFound = followingUsers[index]

                                db.collection('Users')
                                .doc(uidFound)
                                .update({
                                    followers: firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
                                    numberOfFollowers: firebase.firestore.FieldValue.increment(-1),
                                })
                                db.collection('Users')
                                .doc(currentUser.uid)
                                .update({
                                    followingUsers: firebase.firestore.FieldValue.arrayRemove(uidFound),
                                })
                                var newList = followingUsers.filter((u) => u != uidFound)
                                setfollowingUsers(newList)
                                var newNames = usernameList.filter((u) => u != l)
                                setUsernameList(newNames)
                            }
                            },
                            {text: 'Cancel', style: 'cancel'}
                        ]
                    )
                }>
                    <ListItem.Content>
                    <ListItem.Title>{l}</ListItem.Title>
                    </ListItem.Content>
                </ListItem>
            ))
            }
            </ScrollView>

        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        //alignItems: "center",
        padding: 13,
    },
    title: {
        fontSize: 30,
        color: "#363636",
        fontWeight: "bold",
        paddingVertical: 10,
    },
    titleContainer: {
        marginTop: 10,
        marginLeft: 5,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonStyle: {
        marginTop: 10,
        justifyContent: "flex-end",
    },
    backButton: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "flex-start",
    },

    iosButtonSetting: {
        borderWidth: (Platform.OS === 'ios') ? 2 : 0,
        marginVertical: (Platform.OS === 'ios') ? 2 : 0,
        borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
    }
});

export default FollowingPage;