import React, {useState} from 'react';
import { Button, YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import * as Font from 'expo-font';

import { GiftedChat } from "react-native-gifted-chat"
import firebase from '../../firebase_setup';
import styles from '../styles/auth_styles';
import {Notifications} from 'expo';
import * as Permissions from "expo-permissions";

class DirectMessageUserPage extends React.Component {
    state = {
        messages: [],
    }
    
    get uid() {
        return firebase.auth().currentUser.uid;
    }
    
    get user() {
        return {
            name: this.props.route.params.otheruser,
            _id: this.props.route.params.username,
            avatar: this.props.route.params.icon,
        };
    }
    get ref() {
        return firebase.database().ref(this.props.route.params.otheruser > this.uid ? this.props.route.params.otheruser+this.uid : this.uid+this.props.route.params.otheruser);
    }
    get dest_ref() {
        return firebase.database().ref(this.props.route.params.otheruser);
    }
    get timestamp() {
        return firebase.database.ServerValue.TIMESTAMP;
      }
    on = callback => {
        this.ref
          .limitToLast(20)
          .on('child_added', snapshot => callback(this.parse(snapshot)));
    }

    parse = snapshot => {
        const { timestamp: numberStamp, text, user } = snapshot.val();
        const { key: _id } = snapshot;
        const timestamp = new Date(numberStamp);
        const message = {
          _id,
          timestamp,
          text,
          user,
        };
        return message;
      };

      send = messages => {
        firebase.firestore().collection('Users')
        .doc(this.props.route.params.otheruser)
        .get()
        .then(document => {
          if (!document.data().followingOnlyMod || document.data().followingUsers.indexOf(firebase.auth().currentUser.uid) != -1) {
            if (document.data().blockedUsers.indexOf(firebase.auth().currentUser.uid) == -1) {
              for (let i = 0; i < messages.length; i++) {
                const { text, user } = messages[i];
                const message = {
                  text,
                  user,
                  timestamp: this.timestamp,
                };
                this.append(message);
              }
            } else {
              firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then(doc => {
                Alert.alert("You Are Blocked by The User","",[{ text: "Exit", onPress: () => this.props.navigation.navigate('DirectMessageMainPage',{dm: doc.data().dmUsers})}])  
              })
            }
          } else {
            firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then(doc => {
              Alert.alert("The User Only Accepts Messages from Following Users","",[{ text: "Exit", onPress: () => this.props.navigation.navigate('DirectMessageMainPage',{dm: doc.data().dmUsers})}])  
            })
          }
        })
      };
    
      append = message => {
        if (this.state.messages.length == 0) {
          firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).update({
            dmUsers: firebase.firestore.FieldValue.arrayUnion(this.props.route.params.otheruser)
          })
          firebase.firestore().collection("Users").doc(this.props.route.params.otheruser).update({
            dmUsers: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
          })
        }
        this.ref.push(message);
        this.dest_ref.push(message);
      }

      off() {
        this.ref.off();
      }

    render() {
        return (<KeyboardAvoidingView style={[styles.container,{backgroundColor:"#000", alignItems: 'stretch'}]}>
            <View style={{paddingTop: (Platform.OS === 'ios') ? 40: 0}}>
              <View style={{
                borderTopWidth: (Platform.OS === 'ios') ? 2 : 0,
                borderBottomWidth: (Platform.OS === 'ios') ? 2 : 0,
                marginVertical: (Platform.OS === 'ios') ? 2 : 0,
                borderColor: (Platform.OS === 'ios') ? "#ffb300" : "white"
              }}>
                <Button color= "#ffb300"
                    title="DM User List"
                    onPress={() => {
                      firebase.firestore().collection("Users").doc(firebase.auth().currentUser.uid).get().then(doc => {
                        this.props.navigation.navigate('DirectMessageMainPage',{dm: doc.data().dmUsers})
                      })
                    }}
                />
              </View>
            </View>
            <GiftedChat messages={this.state.messages} onSend={this.send} user={this.user}/>
        </KeyboardAvoidingView>)
    }
    componentDidMount() {
        this.on(message =>
            this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
            }))
        );
        firebase.database().ref(firebase.auth().currentUser.uid)
        .endAt()
        .limitToLast(1)
        .off();
    }
    componentWillUnmount() {
        this.off();
        var i = 0;
        firebase.database().ref(firebase.auth().currentUser.uid)
        .endAt()
        .limitToLast(1)
        .on('child_added', snapshot => {
          if (i != 0) {
            Notifications.presentLocalNotificationAsync({
              title: "from: "+snapshot.child("user/_id").val(),
              body: snapshot.child("text").val(),
            });
          }
          i++
        });
    }
}

export default DirectMessageUserPage;