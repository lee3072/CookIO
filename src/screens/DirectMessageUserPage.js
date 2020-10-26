import React, {useState} from 'react';
import { Button, YellowBox, Platform, Dimension, StyleSheet, Text, View, TextInput, Dimensions, TouchableOpacity, KeyboardAvoidingView } from 'react-native';
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
        for (let i = 0; i < messages.length; i++) {
          const { text, user } = messages[i];
          const message = {
            text,
            user,
            timestamp: this.timestamp,
          };
          this.append(message);
        }
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
            <Button color= "#ffb300"
                title="Back"
                onPress={() => {
                    this.props.navigation.navigate('DirectMessageMainPage')
                }}
            />
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