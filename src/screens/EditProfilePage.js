import React from 'react';
import { StyleSheet, Button, Text, View, Alert } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from '../../firebase_setup';
import 'firebase/firestore';
import { TextInput } from 'react-native-gesture-handler';

var db = firebase.firestore();

class EditProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            newEmail: "",
            currentPassword: "",
            newUsername: "",
        };
    }

    //reauthentication function
    reauthenticate = (currentPassword) => {
        var user = firebase.auth().currentUser;
        var cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);
        return user.reauthenticateWithCredential(cred);
    }

    //Change email function
    onChangeEmailPress = () => {
        /* !!! email information inside the documentation did not change*/
        this.reauthenticate(this.state.currentPassword).then(() => {
            var user = firebase.auth().currentUser;
            user.updateEmail(this.state.newEmail).then(() => {
            Alert.alert("Email was changed");
            }).catch((error) => {
                Alert.alert(error.message);
            });
        }).catch((error) => {
            Alert.alert(error.message);
        });

        /*
        var user = firebase.auth().currentUser;
        user.updatePassword(this.state.newPassword).then(() => {
            Alert.alert("Password was changed");
        }).catch((error) => {
            Alert.alert(error.message);
        });
        */
    }

    //change username function
    onChangeUsernamePress = () => {
        /* !!! need to check if username is unique or is empty*/
        /* !!! need to update usernames collection in firestore */
        var user = firebase.auth().currentUser;
        db.collection('Users')
        .doc(user.uid)
        .update({
            userName: this.state.newUsername,
        })
        .then(() => {
            Alert.alert("Username was changed");
        });

    }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Change Password" onPress={() => this.props.navigation.navigate('ChangePasswordPage')} />
        
        <TextInput value={this.state.currentPassword}
        placeholder="Current Password" autoCapitalize="none" secureTextEntry={true}
        onChangeText={(text) => {this.setState({currentPassword: text}) }}
        />

        <TextInput value={this.state.newEmail}
        placeholder="New Email" autoCapitalize="none" keyboardType="email-address"
        onChangeText={(text) => {this.setState({newEmail: text}) }}
        />
        <Button title="Change Email" onPress={this.onChangeEmailPress} />

        <TextInput value={this.state.newUsername}
        placeholder="New Username" autoCapitalize="none"
        onChangeText={(text) => {this.setState({newUsername: text}) }}
        />
        <Button title="Change Username" onPress={this.onChangeUsernamePress} />
      
      </View>

      
    )
  }
}

export default EditProfilePage;