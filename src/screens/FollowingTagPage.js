import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Image, Text, View, SafeAreaView, TextComponent, Alert } from 'react-native';
import { ListItem, Avatar } from 'react-native-elements'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

var db = firebase.firestore(); //firestore

const FollowingTagPage = ({navigation}) => {
    
    const [uid,setUid] = useState('');
    const [followingTags,setfollowingTags] = useState([])

    const updateData = () => {
        setfollowingTags([])
        const currentUser = firebase.auth().currentUser;
        if (currentUser) {
            setUid(currentUser.uid)

            function getTags(documentSnapshot) {
                return documentSnapshot.get('followingTags');
            }
                  
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getTags(documentSnapshot))
            .then(following => {
                setfollowingTags(following);
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
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Following Tags</Text>
                <View style={styles.buttonStyle}>
                    <Button color= "#ffb300"
                        title="Following Users"
                        onPress={() => navigation.navigate('FollowingPage')}
                    />
                </View>
            </View>
            <ScrollView>
            {
            followingTags.map((l, i) => (
                <ListItem key={i} bottomDivider onPress={() =>
                    Alert.alert(
                        l,
                        "",
                        [
                            {text: 'Unfollow', onPress: () => {
                                const currentUser = firebase.auth().currentUser;

                                db.collection('Users')
                                .doc(currentUser.uid)
                                .update({
                                    followingTags: firebase.firestore.FieldValue.arrayRemove(l),
                                })
                                var newTags = followingTags.filter((u) => u != l)
                                setfollowingTags(newTags)
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
        marginTop: 30,
        marginLeft: 5,
        marginBottom: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    buttonStyle: {
        marginTop: 10,
        justifyContent: "flex-end",
    },

});

export default FollowingTagPage;