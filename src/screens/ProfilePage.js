import React from 'react';
//import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';

var db = firebase.firestore(); //firestore

class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: '',
            email: '',
            username: '',
            followers: 0,
            interest: '',

        };
    }


    componentDidMount() {
        //set state
        const currentUser = firebase.auth().currentUser;

        if (currentUser) {
            console.log('Success');
            this.setState({uid: currentUser.uid})
            this.setState({email: currentUser.email})

            function getUserName(documentSnapshot) {
                return documentSnapshot.get('userName');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getUserName(documentSnapshot))
            .then(userName => {
                this.setState({username: userName})
            });

            function getNFollowers(documentSnapshot) {
                return documentSnapshot.get('numberOfFollowers');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getNFollowers(documentSnapshot))
            .then(nFollowers => {
                this.setState({followers: nFollowers})
            });

            function getInterest(documentSnapshot) {
                return documentSnapshot.get('topicsOfInterest');
            }
              
            db.collection('Users')
            .doc(currentUser.uid)
            .get()
            .then(documentSnapshot => getInterest(documentSnapshot))
            .then(topicOfInterest => {
                this.setState({interest: topicOfInterest})
            });
    }

    }

    render() {
        return (
            <View
                style={{
                lex: 1,
                justifyContent: "center",
                alignItems: "center"
            }}>
            <Text>Username: {this.state.username}</Text>
            <Text>Number of Followers: {this.state.followers}</Text>
            <Text>Topic of Interest: {this.state.interest}</Text>
            <Text>Welcome!!</Text>

            <Button
                title="Change Profile"
                onPress={() => this.props.navigation.navigate('EditProfilePage')}
            />
            <Button
                title="Make Post"
                onPress={() => this.props.navigation.navigate('MakePostPage')}
            />
            <Button
                title="Logout"
                onPress={() => {
                        firebase.auth().signOut()
                        this.props.navigation.navigate('SignInPage')
                    }}
            />
            </View>
        );
    }
}


export default ProfilePage;