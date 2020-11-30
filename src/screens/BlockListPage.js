import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, Text, View, SafeAreaView, TextComponent, Alert } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

var db = firebase.firestore(); //firestore

const BlockListPage = ({navigation}) => {
    
    const [uid,setUid] = useState('');
    const [blockedUsers,setBlockedUsers] = useState([])
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
        setBlockedUsers([])
        const currentUser = firebase.auth().currentUser;
        console.log('hey')
        if (currentUser) {

            setUid(currentUser.uid)

            function getBlockedUsers(documentSnapshot) {
                return documentSnapshot.get('blockedUsers');
            }
                  
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getBlockedUsers(documentSnapshot))
            .then(blocked => {
                setBlockedUsers(blocked);
                uidToNameList(blocked)
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
            <View style={styles.backButton}>
            <Button
                color= "#ffdb85"
                title="back"
                onPress={() => {
                    navigation.navigate('ProfilePage')
                }}
            />
            </View>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Blocked Users</Text>
            </View>
            <ScrollView>
            {
            usernameList.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={() =>
                    Alert.alert(
                        l,
                        "",
                        [

                            {text: 'Unblock', onPress: () => {
                                const currentUser = firebase.auth().currentUser;
                                var index = usernameList.indexOf(l)
                                var uidFound = blockedUsers[index]

                                
                                db.collection('Users')
                                .doc(currentUser.uid)
                                .update({
                                    blockedUsers: firebase.firestore.FieldValue.arrayRemove(uidFound),
                                })
                                var newList = blockedUsers.filter((u) => u != uidFound)
                                setBlockedUsers(newList)
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

});

export default BlockListPage;